import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { Refund, RefundStatus, RefundReason } from './entities/refund.entity';
import { Users } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

export class CreateOrderDto {
  customerId: number;
  items: OrderItemDto[];
  note?: string;
  shippingAddress?: string;
  phoneNumber?: string;
}

export class OrderItemDto {
  productId: number;
  quantity: number;
}

export class CreatePaymentDto {
  orderId: number;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  referenceNumber?: string;
}

export class CreateRefundDto {
  orderId: number;
  amount: number;
  reason: RefundReason;
  description?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // ============ ORDER MANAGEMENT ============

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, items, note, shippingAddress, phoneNumber } = createOrderDto;

    // Verify customer exists
    const customer = await this.userRepository.findOne({
      where: { id: customerId }
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId }
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const unitPrice = product.price || 0;
      totalAmount += unitPrice * item.quantity;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        unitPrice
      });
      orderItems.push(orderItem);
    }

    // Create order
    const order = this.orderRepository.create({
      customer,
      totalAmount,
      note,
      shippingAddress,
      phoneNumber,
      orderItems
    });

    const savedOrder = await this.orderRepository.save(order);

    // Save order items
    for (const item of orderItems) {
      item.order = savedOrder;
      await this.orderItemRepository.save(item);
    }

    return await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'orderItems', 'orderItems.product']
    }) as Order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['customer', 'orderItems', 'orderItems.product', 'payments'],
      order: { createdAt: 'DESC' }
    });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'orderItems', 'orderItems.product', 'payments', 'payments.processedBy']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['orderItems', 'orderItems.product', 'payments'],
      order: { createdAt: 'DESC' }
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = status;
    return await this.orderRepository.save(order);
  }

  // ============ PAYMENT MANAGEMENT ============

  async createPayment(createPaymentDto: CreatePaymentDto, adminId: number): Promise<Payment> {
    const { orderId, amount, method, transactionId, referenceNumber } = createPaymentDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const admin = await this.userRepository.findOne({
      where: { id: adminId }
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    const payment = this.paymentRepository.create({
      order,
      amount,
      method,
      transactionId,
      referenceNumber,
      processedBy: admin
    });

    return await this.paymentRepository.save(payment);
  }

  async verifyPayment(paymentId: number, adminId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order']
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    payment.status = PaymentStatus.COMPLETED;

    // Update order status to paid
    if (payment.order) {
      payment.order.status = OrderStatus.PAID;
      await this.orderRepository.save(payment.order);
    }

    return await this.paymentRepository.save(payment);
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['order', 'order.customer', 'processedBy'],
      order: { createdAt: 'DESC' }
    });
  }

  async getPaymentsByOrder(orderId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { order: { id: orderId } },
      relations: ['processedBy'],
      order: { createdAt: 'DESC' }
    });
  }

  // ============ REFUND MANAGEMENT ============

  async createRefund(createRefundDto: CreateRefundDto, customerId: number): Promise<Refund> {
    const { orderId, amount, reason, description } = createRefundDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customerId } }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found or doesn't belong to customer`);
    }

    const customer = await this.userRepository.findOne({
      where: { id: customerId }
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Check if refund amount is valid
    if (amount > order.totalAmount) {
      throw new BadRequestException('Refund amount cannot exceed order total');
    }

    const refund = this.refundRepository.create({
      order,
      amount,
      reason,
      description,
      requestedBy: customer
    });

    return await this.refundRepository.save(refund);
  }

  async approveRefund(refundId: number, adminId: number, adminNotes?: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId },
      relations: ['order']
    });

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    if (refund.status !== RefundStatus.REQUESTED) {
      throw new BadRequestException('Refund is not in requested status');
    }

    const admin = await this.userRepository.findOne({
      where: { id: adminId }
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    refund.status = RefundStatus.APPROVED;
    refund.processedBy = admin;
    refund.adminNotes = adminNotes;

    // Update order status
    if (refund.order) {
      refund.order.status = OrderStatus.REFUNDED;
      await this.orderRepository.save(refund.order);
    }

    return await this.refundRepository.save(refund);
  }

  async rejectRefund(refundId: number, adminId: number, adminNotes?: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId }
    });

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    if (refund.status !== RefundStatus.REQUESTED) {
      throw new BadRequestException('Refund is not in requested status');
    }

    const admin = await this.userRepository.findOne({
      where: { id: adminId }
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    refund.status = RefundStatus.REJECTED;
    refund.processedBy = admin;
    refund.adminNotes = adminNotes;

    return await this.refundRepository.save(refund);
  }

  async processRefund(refundId: number, transactionId?: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId }
    });

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    if (refund.status !== RefundStatus.APPROVED) {
      throw new BadRequestException('Refund must be approved before processing');
    }

    refund.status = RefundStatus.PROCESSING;
    if (transactionId) {
      refund.refundTransactionId = transactionId;
    }

    return await this.refundRepository.save(refund);
  }

  async completeRefund(refundId: number): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId }
    });

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    if (refund.status !== RefundStatus.PROCESSING) {
      throw new BadRequestException('Refund must be processing before completion');
    }

    refund.status = RefundStatus.COMPLETED;
    return await this.refundRepository.save(refund);
  }

  async getAllRefunds(): Promise<Refund[]> {
    return await this.refundRepository.find({
      relations: ['order', 'order.customer', 'requestedBy', 'processedBy', 'originalPayment'],
      order: { createdAt: 'DESC' }
    });
  }

  async getRefundsByOrder(orderId: number): Promise<Refund[]> {
    return await this.refundRepository.find({
      where: { order: { id: orderId } },
      relations: ['requestedBy', 'processedBy'],
      order: { createdAt: 'DESC' }
    });
  }

  async getPendingRefunds(): Promise<Refund[]> {
    return await this.refundRepository.find({
      where: { status: RefundStatus.REQUESTED },
      relations: ['order', 'order.customer', 'requestedBy'],
      order: { createdAt: 'ASC' }
    });
  }

  // ============ STATISTICS ============

  async getOrderStatistics() {
    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({
      where: { status: OrderStatus.PENDING }
    });
    const paidOrders = await this.orderRepository.count({
      where: { status: OrderStatus.PAID }
    });
    const processingOrders = await this.orderRepository.count({
      where: { status: OrderStatus.PROCESSING }
    });
    const shippedOrders = await this.orderRepository.count({
      where: { status: OrderStatus.SHIPPED }
    });
    const deliveredOrders = await this.orderRepository.count({
      where: { status: OrderStatus.DELIVERED }
    });
    const cancelledOrders = await this.orderRepository.count({
      where: { status: OrderStatus.CANCELLED }
    });
    const refundedOrders = await this.orderRepository.count({
      where: { status: OrderStatus.REFUNDED }
    });

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
      })
      .getRawOne();

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        paid: paidOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        refunded: refundedOrders
      },
      revenue: {
        total: parseFloat(totalRevenue?.total || '0')
      }
    };
  }

  async getPaymentStatistics() {
    const totalPayments = await this.paymentRepository.count();
    const pendingPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.PENDING }
    });
    const completedPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.COMPLETED }
    });
    const failedPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.FAILED }
    });
    const refundedPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.REFUNDED }
    });

    return {
      payments: {
        total: totalPayments,
        pending: pendingPayments,
        completed: completedPayments,
        failed: failedPayments,
        refunded: refundedPayments
      }
    };
  }

  async getRefundStatistics() {
    const totalRefunds = await this.refundRepository.count();
    const requestedRefunds = await this.refundRepository.count({
      where: { status: RefundStatus.REQUESTED }
    });
    const approvedRefunds = await this.refundRepository.count({
      where: { status: RefundStatus.APPROVED }
    });
    const processingRefunds = await this.refundRepository.count({
      where: { status: RefundStatus.PROCESSING }
    });
    const completedRefunds = await this.refundRepository.count({
      where: { status: RefundStatus.COMPLETED }
    });
    const rejectedRefunds = await this.refundRepository.count({
      where: { status: RefundStatus.REJECTED }
    });

    const totalRefundAmount = await this.refundRepository
      .createQueryBuilder('refund')
      .select('SUM(refund.amount)', 'total')
      .where('refund.status = :status', { status: RefundStatus.COMPLETED })
      .getRawOne();

    return {
      refunds: {
        total: totalRefunds,
        requested: requestedRefunds,
        approved: approvedRefunds,
        processing: processingRefunds,
        completed: completedRefunds,
        rejected: rejectedRefunds
      },
      totalRefundedAmount: parseFloat(totalRefundAmount?.total || '0')
    };
  }
}

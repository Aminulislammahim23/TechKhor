import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/entities/product.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Payment } from '../payments/entities/payment.entity';

type OrderCustomerInfo = {
  customerName?: string;
  customerPhone?: string;
  deliveryType?: string;
  deliveryAddress?: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    private cartService: CartService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) { }

  // 🔥 Cart → Order (MAIN FLOW)
  async createFromCart(userId: number) {
    const cart = await this.cartService.getCart(userId);

    if (!cart || !cart.items.length) {
      throw new NotFoundException('Cart is empty');
    }

    const orderItems = cart.items.map((item) =>
      this.itemRepo.create({
        product: item.product,
        quantity: item.quantity,
        price: 100, // later dynamic price
      }),
    );

    const total = orderItems.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0,
    );

    const order = this.orderRepo.create({
      user: { id: userId },
      items: orderItems,
      totalPrice: total,
      status: 'pending',
    });

    await this.orderRepo.save(order);

    return order;
  }

  async createFromItems(
    user: { id: number; role?: string },
    items: Array<{ productId: number; quantity: number }>,
    customerInfo: OrderCustomerInfo = {},
  ) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Items are required');
    }

    const userId = Number(user.id);
    const isSellerOrder = user.role === 'seller';
    const customerName = String(customerInfo.customerName || '').trim();
    const customerPhone = String(customerInfo.customerPhone || '').trim();
    const deliveryType = String(customerInfo.deliveryType || '').trim() || null;
    const deliveryAddress = String(customerInfo.deliveryAddress || '').trim() || null;
    let posCustomer: Awaited<ReturnType<UsersService['findOrCreatePosCustomer']>> | null = null;

    if (isSellerOrder && !customerName) {
      throw new BadRequestException('Customer name is required');
    }

    if (isSellerOrder && !customerPhone) {
      throw new BadRequestException('Customer phone is required');
    }

    if (isSellerOrder) {
      posCustomer = await this.usersService.findOrCreatePosCustomer(
        customerName,
        customerPhone,
      );
    }

    const orderItems: OrderItem[] = [];
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;
    const discountRate = posCustomer?.discountRate || 0;

    for (const entry of items) {
      const quantity = Number(entry?.quantity || 0);
      const productId = Number(entry?.productId || 0);

      if (!productId || quantity <= 0) {
        throw new BadRequestException('Invalid product item in order');
      }

      const product = await this.productRepo.findOne({
        where: { id: productId },
        relations: ['seller'],
      });
      if (!product) {
        throw new NotFoundException(`Product not found: ${productId}`);
      }

      const isOwnSellerProduct =
        isSellerOrder && Number(product.seller?.id) === Number(userId);

      if (!product.isApproved && !isOwnSellerProduct) {
        throw new BadRequestException(`Product not approved: ${product.name}`);
      }

      if (Number(product.stock) < quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      const offerPrice = Number(product.offerPrice);
      const hasOfferPrice = Boolean(product.isOffer) && Number.isFinite(offerPrice) && offerPrice > 0;
      const originalPrice = hasOfferPrice ? offerPrice : Number(product.price);
      const discountedPrice = this.roundMoney(originalPrice * (1 - discountRate));

      totalBeforeDiscount += originalPrice * quantity;
      totalAfterDiscount += discountedPrice * quantity;

      orderItems.push(
        this.itemRepo.create({
          product: { id: product.id } as Product,
          quantity,
          price: discountedPrice,
        }),
      );

      product.stock = Number(product.stock) - quantity;
      await this.productRepo.save(product);
    }

    const total = this.roundMoney(totalAfterDiscount);
    const customerDiscountAmount = this.roundMoney(totalBeforeDiscount - totalAfterDiscount);
    const registeredCustomer = !isSellerOrder ? await this.usersService.findById(userId) : null;

    const order = this.orderRepo.create({
      user: { id: userId },
      customer: posCustomer
        ? { id: posCustomer.customer.id }
        : registeredCustomer
          ? { id: registeredCustomer.id }
          : null,
      items: orderItems,
      totalPrice: total,
      status: 'pending',
      customerName: customerName || posCustomer?.customer.fullName || registeredCustomer?.fullName || null,
      customerPhone:
        this.usersService.normalizePhone(customerPhone) || registeredCustomer?.phone || null,
      deliveryType,
      deliveryAddress,
      customerDiscountAmount,
      customerDiscountRate: discountRate,
    });

    const savedOrder = await this.orderRepo.save(order);
    const savedOrderWithRelations = await this.findOne(savedOrder.id);
    await this.notificationsService.createHomeDeliveryApprovalNotifications(
      savedOrderWithRelations,
    );

    return savedOrderWithRelations;
  }

  // ✅ Get My Orders
  async findMyOrders(userId: number) {
    return this.orderRepo.find({
      where: [{ user: { id: userId } }, { customer: { id: userId } }],
      relations: ['items', 'items.product', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ Get Single Order
  async findAllForAdmin() {
    return this.orderRepo.find({
      relations: ['user', 'customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product', 'items.product.seller', 'customer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // 🔥 Payment Integration
  async markAsPaid(orderId: number) {
    const order = await this.findOne(orderId);

    if (order.status === 'paid') {
      return order;
    }

    order.status = 'paid';

    return this.orderRepo.save(order);
  }

  // ❌ optional delete
  async requestCancel(orderId: number, userId: number) {
    const order = await this.findOne(orderId);
    const ownsOrder =
      Number(order.user?.id) === Number(userId) ||
      Number(order.customer?.id) === Number(userId);

    if (!ownsOrder) {
      throw new BadRequestException('You cannot cancel this order');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can request cancellation');
    }

    order.cancelRequested = true;
    order.cancelRequestedAt = new Date();

    return this.orderRepo.save(order);
  }

  async findSellerCancelRequests(sellerId: number) {
    const orders = await this.orderRepo.find({
      where: { status: 'pending', cancelRequested: true },
      relations: ['user', 'customer', 'items', 'items.product', 'items.product.seller'],
      order: { cancelRequestedAt: 'DESC' },
    });

    return orders
      .map((order) => {
        const sellerItems = (order.items || []).filter(
          (item) => Number(item.product?.seller?.id) === Number(sellerId),
        );

        if (sellerItems.length === 0) {
          return null;
        }

        return {
          id: order.id,
          orderId: order.id,
          totalPrice: Number(order.totalPrice),
          customerName: order.customerName || order.customer?.fullName || order.user?.fullName || null,
          customerPhone: order.customerPhone || order.customer?.phone || order.user?.phone || null,
          cancelRequestedAt: order.cancelRequestedAt,
          items: sellerItems.map((item) => ({
            name: item.product?.name || 'Product',
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        };
      })
      .filter(Boolean);
  }

  async acceptCancel(orderId: number, user: { id: number; role?: string }) {
    const order = await this.findOne(orderId);

    if (order.status !== 'pending' || !order.cancelRequested) {
      throw new BadRequestException('No pending cancellation request for this order');
    }

    const canAccept =
      user.role === 'admin' ||
      order.items?.some((item) => Number(item.product?.seller?.id) === Number(user.id));

    if (!canAccept) {
      throw new BadRequestException('You cannot approve this cancellation');
    }

    for (const item of order.items || []) {
      const product = item.product;
      if (!product?.id) continue;
      product.stock = Number(product.stock || 0) + Number(item.quantity || 0);
      await this.productRepo.save(product);
    }

    const payment = await this.paymentRepo.findOne({
      where: { order: { id: order.id }, status: 'pending' },
    });

    if (payment) {
      payment.status = 'canceled';
      await this.paymentRepo.save(payment);
    }

    order.status = 'canceled';
    order.cancelRequested = false;

    return this.orderRepo.save(order);
  }

  async remove(orderId: number) {
    const order = await this.findOne(orderId);
    await this.orderRepo.remove(order);

    return { message: 'Order deleted' };
  }

  private roundMoney(value: number) {
    return Number(value.toFixed(2));
  }
}

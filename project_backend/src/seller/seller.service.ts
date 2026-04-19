import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Users, UserStatus, Role } from '../users/entities/user.entity';
import { Category } from '../products/entities/category.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { WithdrawRequest, WithdrawStatus } from './entities/withdraw-request.entity';
import { Message, MessageType } from './entities/message.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateWithdrawRequestDto } from './dto/create-withdraw-request.dto';
import { CreateMessageDto, ReplyMessageDto } from './dto/create-message.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(WithdrawRequest)
    private withdrawRequestsRepository: Repository<WithdrawRequest>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<Product> {
    // Verify seller exists and is approved
    const seller = await this.usersRepository.findOne({
      where: { id: sellerId, role: Role.SELLER }
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.status !== UserStatus.APPROVED) {
      throw new ForbiddenException('Seller account is not approved');
    }

    const { categoryId, ...productData } = createProductDto;

    let category: Category | undefined;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId }
      }) || undefined;
      if (!category) {
        throw new BadRequestException(`Category with ID ${categoryId} not found`);
      }
    }

    const product = this.productsRepository.create({
      ...productData,
      seller: { id: sellerId } as Users,
      category,
      status: ProductStatus.PENDING, // Products start as pending for admin approval
    });

    return await this.productsRepository.save(product);
  }

  async getMyProducts(sellerId: number): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProductById(sellerId: number, productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId, seller: { id: sellerId } },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found or does not belong to this seller');
    }

    return product;
  }

  async updateProduct(sellerId: number, productId: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(sellerId, productId);

    // Sellers can only update certain fields, not status
    const { categoryId, ...updateData } = updateProductDto;

    if (categoryId !== undefined) {
      if (categoryId === null) {
        product.category = undefined;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId }
        });
        if (!category) {
          throw new BadRequestException(`Category with ID ${categoryId} not found`);
        }
        product.category = category;
      }
    }

    Object.assign(product, updateData);
    return await this.productsRepository.save(product);
  }

  async updateProductPrice(sellerId: number, productId: number, price: number): Promise<Product> {
    if (price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    const product = await this.getProductById(sellerId, productId);
    product.price = price;
    return await this.productsRepository.save(product);
  }

  async updateProductStock(sellerId: number, productId: number, stock: number): Promise<Product> {
    if (stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    const product = await this.getProductById(sellerId, productId);
    product.stock = stock;
    return await this.productsRepository.save(product);
  }

  async deleteProduct(sellerId: number, productId: number): Promise<void> {
    const product = await this.getProductById(sellerId, productId);

    // Only allow deletion of products that haven't been approved yet
    if (product.status === ProductStatus.APPROVED) {
      throw new BadRequestException('Cannot delete approved products. Contact admin to remove.');
    }

    await this.productsRepository.remove(product);
  }

  // ============ ORDER MANAGEMENT ============

  async getMyOrders(sellerId: number): Promise<Order[]> {
    // Get all order items for this seller's products, then get the orders
    const orderItems = await this.orderItemsRepository.find({
      where: { product: { seller: { id: sellerId } } },
      relations: ['order', 'product'],
    });

    const orderIds = [...new Set(orderItems.map(item => item.order.id))];

    if (orderIds.length === 0) {
      return [];
    }

    return await this.ordersRepository.find({
      where: orderIds.map(id => ({ id })),
      relations: ['customer', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(sellerId: number, orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if order contains seller's products
    const hasSellerProducts = order.orderItems.some(item => item.product.seller.id === sellerId);
    if (!hasSellerProducts) {
      throw new ForbiddenException('Order does not contain your products');
    }

    return order;
  }

  async updateOrderStatus(sellerId: number, orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(sellerId, orderId);

    // Validate status transitions for sellers
    const allowedStatuses = [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Sellers can only update status to Processing, Shipped, or Delivered');
    }

    // Business logic for status transitions
    if (order.status === OrderStatus.PAID && status === OrderStatus.PROCESSING) {
      // Accept order
    } else if (order.status === OrderStatus.PROCESSING && status === OrderStatus.SHIPPED) {
      // Mark as shipped
    } else if (order.status === OrderStatus.SHIPPED && status === OrderStatus.DELIVERED) {
      // Mark as delivered
    } else {
      throw new BadRequestException('Invalid status transition');
    }

    order.status = status;
    return await this.ordersRepository.save(order);
  }

  // ============ INVENTORY MANAGEMENT ============

  async getLowStockProducts(sellerId: number): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        seller: { id: sellerId },
        stock: 0, // Out of stock
      },
      relations: ['category'],
    });
  }

  async getLowStockAlerts(sellerId: number, threshold: number = 5): Promise<Product[]> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.sellerId = :sellerId', { sellerId })
      .andWhere('product.stock <= :threshold', { threshold })
      .andWhere('product.stock > 0')
      .leftJoinAndSelect('product.category', 'category')
      .getMany();
  }

  // ============ EARNINGS & REPORTS ============

  async getSalesReport(sellerId: number, startDate?: Date, endDate?: Date): Promise<any> {
    let query = this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('orderItem.product', 'product')
      .where('product.sellerId = :sellerId', { sellerId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.DELIVERED, OrderStatus.SHIPPED]
      });

    if (startDate) {
      query = query.andWhere('order.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query = query.andWhere('order.createdAt <= :endDate', { endDate });
    }

    const orderItems = await query
      .select([
        'SUM(orderItem.quantity * orderItem.unitPrice) as totalSales',
        'SUM(orderItem.quantity) as totalQuantity',
        'COUNT(DISTINCT order.id) as totalOrders',
      ])
      .getRawOne();

    return {
      totalSales: parseFloat(orderItems.totalSales || 0),
      totalQuantity: parseInt(orderItems.totalQuantity || 0),
      totalOrders: parseInt(orderItems.totalOrders || 0),
    };
  }

  async getEarnings(sellerId: number): Promise<any> {
    // Calculate total earnings from completed orders
    const earnings = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('orderItem.product', 'product')
      .where('product.sellerId = :sellerId', { sellerId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .select('SUM(orderItem.quantity * orderItem.unitPrice) as totalEarnings')
      .getRawOne();

    // Calculate pending withdrawals
    const pendingWithdrawals = await this.withdrawRequestsRepository
      .createQueryBuilder('withdraw')
      .where('withdraw.sellerId = :sellerId', { sellerId })
      .andWhere('withdraw.status IN (:...statuses)', {
        statuses: [WithdrawStatus.PENDING, WithdrawStatus.APPROVED]
      })
      .select('SUM(withdraw.amount) as pendingAmount')
      .getRawOne();

    const totalEarnings = parseFloat(earnings.totalEarnings || 0);
    const pendingAmount = parseFloat(pendingWithdrawals.pendingAmount || 0);
    const availableBalance = totalEarnings - pendingAmount;

    return {
      totalEarnings,
      pendingWithdrawals: pendingAmount,
      availableBalance: Math.max(0, availableBalance),
    };
  }

  async createWithdrawRequest(sellerId: number, createWithdrawRequestDto: CreateWithdrawRequestDto): Promise<WithdrawRequest> {
    const earnings = await this.getEarnings(sellerId);

    if (createWithdrawRequestDto.amount > earnings.availableBalance) {
      throw new BadRequestException('Insufficient balance for withdrawal');
    }

    const withdrawRequest = this.withdrawRequestsRepository.create({
      ...createWithdrawRequestDto,
      seller: { id: sellerId } as Users,
    });

    return await this.withdrawRequestsRepository.save(withdrawRequest);
  }

  async getWithdrawRequests(sellerId: number): Promise<WithdrawRequest[]> {
    return await this.withdrawRequestsRepository.find({
      where: { seller: { id: sellerId } },
      order: { createdAt: 'DESC' },
    });
  }

  // ============ CUSTOMER INTERACTION ============

  async getMessages(sellerId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: { receiver: { id: sellerId } },
      relations: ['sender', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async sendMessage(sellerId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepository.create({
      ...createMessageDto,
      sender: { id: sellerId } as Users,
      receiver: { id: createMessageDto.receiverId } as Users,
      type: MessageType.SELLER_TO_CUSTOMER,
    });

    if (createMessageDto.productId) {
      message.product = { id: createMessageDto.productId } as Product;
      message.type = MessageType.PRODUCT_ANSWER;
    }

    return await this.messagesRepository.save(message);
  }

  async replyToMessage(sellerId: number, messageId: number, replyDto: ReplyMessageDto): Promise<Message> {
    const originalMessage = await this.messagesRepository.findOne({
      where: { id: messageId, receiver: { id: sellerId } },
      relations: ['sender', 'product'],
    });

    if (!originalMessage) {
      throw new NotFoundException('Message not found');
    }

    const reply = this.messagesRepository.create({
      content: replyDto.content,
      sender: { id: sellerId } as Users,
      receiver: originalMessage.sender,
      product: originalMessage.product,
      type: originalMessage.type === MessageType.PRODUCT_QUESTION
        ? MessageType.PRODUCT_ANSWER
        : MessageType.SELLER_TO_CUSTOMER,
    });

    return await this.messagesRepository.save(reply);
  }

  async getProductQuestions(sellerId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: {
        type: MessageType.PRODUCT_QUESTION,
        product: { seller: { id: sellerId } }
      },
      relations: ['sender', 'product'],
      order: { createdAt: 'DESC' },
    });
  }
}
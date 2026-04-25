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

type OrderCustomerInfo = {
  customerName?: string;
  customerPhone?: string;
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

    private cartService: CartService,
    private usersService: UsersService,
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

      const originalPrice = Number(product.price);
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

    const order = this.orderRepo.create({
      user: { id: userId },
      customer: posCustomer ? { id: posCustomer.customer.id } : null,
      items: orderItems,
      totalPrice: total,
      status: 'pending',
      customerName: customerName || posCustomer?.customer.fullName || null,
      customerPhone: this.usersService.normalizePhone(customerPhone) || null,
      customerDiscountAmount,
      customerDiscountRate: discountRate,
    });

    return this.orderRepo.save(order);
  }

  // ✅ Get My Orders
  async findMyOrders(userId: number) {
    return this.orderRepo.find({
      where: [{ user: { id: userId } }, { customer: { id: userId } }],
      relations: ['items', 'items.product', 'customer'],
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
      relations: ['items', 'items.product', 'customer'],
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
  async remove(orderId: number) {
    const order = await this.findOne(orderId);
    await this.orderRepo.remove(order);

    return { message: 'Order deleted' };
  }

  private roundMoney(value: number) {
    return Number(value.toFixed(2));
  }
}

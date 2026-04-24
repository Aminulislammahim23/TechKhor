import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    private cartService: CartService,
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

  // ✅ Get My Orders
  async findMyOrders(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  // ✅ Get Single Order
  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
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
}
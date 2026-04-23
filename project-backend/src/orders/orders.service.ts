import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalPrice: number;
  status: string;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  create(userId: number, dto: CreateOrderDto) {
    const total = dto.items.reduce(
      (sum, item) => sum + item.quantity * 100, // dummy price
      0,
    );

    const order: Order = {
      id: Date.now(),
      userId,
      items: dto.items,
      totalPrice: total,
      status: 'pending',
    };

    this.orders.push(order);
    return order;
  }

  findMyOrders(userId: number) {
    return this.orders.filter(o => o.userId === userId);
  }
}
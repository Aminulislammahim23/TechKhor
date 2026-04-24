import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  createdAt: Date;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  // ✅ Create Order
  create(userId: number, dto: CreateOrderDto) {
    const total = dto.items.reduce(
      (sum, item) => sum + item.quantity * 100,
      0,
    );

    const order: Order = {
      id: Date.now(),
      userId,
      items: dto.items,
      totalPrice: total,
      status: 'pending',
      createdAt: new Date(),
    };

    this.orders.push(order);
    return order;
  }

  // ✅ Get My Orders
  findMyOrders(userId: number) {
    return this.orders.filter((o) => o.userId === userId);
  }

  // ✅ Get Single Order (🔥 REQUIRED for payment)
  findOne(id: number) {
    const order = this.orders.find((o) => o.id === id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // ✅ Mark Order as Paid (🔥 CRITICAL)
  markAsPaid(orderId: number) {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'paid') {
      return order; // already paid
    }

    order.status = 'paid';

    return order;
  }

  // ✅ Optional: Delete Order
  remove(orderId: number) {
    const index = this.orders.findIndex((o) => o.id === orderId);

    if (index === -1) {
      throw new NotFoundException('Order not found');
    }

    this.orders.splice(index, 1);

    return { message: 'Order deleted' };
  }
}
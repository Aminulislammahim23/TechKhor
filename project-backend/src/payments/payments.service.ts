import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';


@Injectable()
export class PaymentsService {
  private payments: Payment[] = [];

  constructor(private ordersService: OrdersService) {}

  async create(userId: number, dto: any) {
    const existing = this.payments.find(
      (p) => p.orderId === dto.orderId,
    );

    if (existing) {
      throw new BadRequestException('Payment already completed');
    }

    const order = await this.ordersService.findOne(dto.orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment: Payment = {
      id: Date.now(),
      userId,
      orderId: dto.orderId,
      amount: dto.amount,
      method: dto.method,
      status: 'pending',
      transactionId: null,
      createdAt: new Date(),
    };

    if (dto.method === 'mock') {
      payment.status = 'success';
      payment.transactionId = 'TXN-' + Date.now();

      await this.ordersService.markAsPaid(dto.orderId);
    }

    this.payments.push(payment);

    return {
      message: 'Payment processed successfully',
      payment,
    };
  }

  findAll(userId: number) {
    return this.payments.filter((p) => p.userId === userId);
  }

  findOne(id: number) {
    const payment = this.payments.find((p) => p.id === id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
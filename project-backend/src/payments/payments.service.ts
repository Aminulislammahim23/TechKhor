import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private payments = [];

  create(userId: number, dto: any) {
    const payment = {
      id: Date.now(),
      userId,
      orderId: dto.orderId,
      amount: dto.amount,
      method: dto.method,
      status: 'pending',
      transactionId: null,
    };

    // 👉 MOCK SUCCESS LOGIC
    if (dto.method === 'mock') {
      payment.status = 'success';
      payment.transactionId = 'TXN-' + Date.now();
    }

    this.payments.push(payment);
    return payment;
  }

  findAll(userId: number) {
    return this.payments.filter(p => p.userId === userId);
  }

  findOne(id: number) {
    const payment = this.payments.find(p => p.id === id);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
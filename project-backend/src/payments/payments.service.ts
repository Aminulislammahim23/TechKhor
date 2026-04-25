import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { EarningsService } from '../earnings/earnings.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private ordersService: OrdersService,
    private earningsService: EarningsService,
  ) {}

  async create(userId: number, dto: CreatePaymentDto) {
    // 1. Prevent duplicate payment for same order
    const existing = await this.paymentRepo.findOne({
      where: { order: { id: dto.orderId } },
    });

    if (existing && existing.status === 'success') {
      throw new BadRequestException('Payment already completed for this order');
    }

    // 2. Validate order exists using OrdersService
    const order = await this.ordersService.findOne(dto.orderId);

    // 3. Create payment record
    const payment = this.paymentRepo.create({
      user: { id: userId },
      order: { id: dto.orderId },
      amount: dto.amount,
      method: dto.method,
      status: 'pending',
      transactionId: null,
    });

    // 4. For POS-friendly methods, process immediately
    if (['mock', 'cash', 'card'].includes(String(dto.method).toLowerCase())) {
      payment.status = 'success';
      payment.transactionId = `TXN-${String(dto.method || 'mock').toUpperCase()}-${Date.now()}`;

      await this.ordersService.markAsPaid(dto.orderId);
    }

    const savedPayment = await this.paymentRepo.save(payment);

    if (savedPayment.status === 'success') {
      await this.earningsService.generateForSuccessfulPayment(
        savedPayment.id,
        dto.orderId,
      );
    }

    return savedPayment;
  }

  async findAll(userId: number) {
    return this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ['order'],
    });
  }

  async findAllForAdmin() {
    return this.paymentRepo.find({
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}

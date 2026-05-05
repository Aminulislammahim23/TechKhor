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
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private ordersService: OrdersService,
    private earningsService: EarningsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(user: { id: number; role?: string }, dto: CreatePaymentDto) {
    const userId = Number(user.id);
    // 1. Validate order ownership before exposing payment state.
    const order = await this.ordersService.findOneForUser(dto.orderId, user);

    // 2. Prevent duplicate payment for same order
    const existing = await this.paymentRepo.findOne({
      where: { order: { id: dto.orderId } },
    });

    if (existing && existing.status === 'success') {
      throw new BadRequestException('Payment already completed for this order');
    }

    if (existing && existing.status === 'pending') {
      await this.notificationsService.createPaymentApprovalNotifications(
        order,
        existing.id,
      );
      return existing;
    }

    // 3. Create payment record
    const payment = this.paymentRepo.create({
      user: { id: userId },
      order: { id: dto.orderId },
      amount: dto.amount,
      method: dto.method,
      status: 'pending',
      transactionId: null,
    });

    // 4. Seller POS-friendly methods process immediately. Customer online purchases wait for seller approval.
    if (
      user.role === 'seller' &&
      ['mock', 'cash', 'card'].includes(String(dto.method).toLowerCase())
    ) {
      payment.status = 'success';
      payment.transactionId = `TXN-${String(dto.method || 'mock').toUpperCase()}-${Date.now()}`;

      await this.ordersService.markAsPaid(dto.orderId);
    }

    const savedPayment = await this.paymentRepo.save(payment);

    if (savedPayment.status === 'success') {
      await this.finalizeSuccessfulPayment(savedPayment);
    } else {
      await this.notificationsService.createPaymentApprovalNotifications(
        order,
        savedPayment.id,
      );
    }

    return savedPayment;
  }

  async approvePayment(
    paymentId: number,
    user: { id: number; role?: string },
  ) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: [
        'order',
        'order.items',
        'order.items.product',
        'order.items.product.seller',
      ],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'success') {
      return payment;
    }

    const canApprove =
      user.role === 'admin' ||
      payment.order?.items?.some(
        (item) => Number(item.product?.seller?.id) === Number(user.id),
      );

    if (!canApprove) {
      throw new BadRequestException('You cannot approve this payment');
    }

    payment.status = 'success';
    payment.transactionId =
      payment.transactionId || `TXN-SELLER-APPROVED-${Date.now()}`;

    await this.ordersService.markAsPaid(payment.order.id);
    const savedPayment = await this.paymentRepo.save(payment);
    await this.finalizeSuccessfulPayment(savedPayment);

    return savedPayment;
  }

  async findAll(userId: number) {
    return this.paymentRepo.find({
      where: [
        { user: { id: userId } },
        { order: { user: { id: userId } } },
        { order: { customer: { id: userId } } },
      ],
      relations: ['order', 'order.user', 'order.customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForAdmin() {
    return this.paymentRepo.find({
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingApprovalsForSeller(sellerId: number) {
    const pendingPayments = await this.paymentRepo.find({
      where: { status: 'pending' },
      relations: [
        'user',
        'order',
        'order.customer',
        'order.items',
        'order.items.product',
        'order.items.product.seller',
      ],
      order: { createdAt: 'DESC' },
    });

    return pendingPayments
      .map((payment) => {
        const sellerItems = (payment.order?.items || []).filter(
          (item) => Number(item.product?.seller?.id) === Number(sellerId),
        );

        if (sellerItems.length === 0) {
          return null;
        }

        return {
          id: payment.id,
          paymentId: payment.id,
          orderId: payment.order?.id,
          amount: Number(payment.amount),
          method: payment.method,
          status: payment.status,
          customerName:
            payment.order?.customerName ||
            payment.order?.customer?.fullName ||
            payment.user?.fullName ||
            null,
          customerPhone:
            payment.order?.customerPhone ||
            payment.order?.customer?.phone ||
            payment.user?.phone ||
            null,
          deliveryType: payment.order?.deliveryType,
          deliveryAddress: payment.order?.deliveryAddress,
          createdAt: payment.createdAt,
          items: sellerItems.map((item) => ({
            name: item.product?.name || 'Product',
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        };
      })
      .filter(Boolean);
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['user', 'order', 'order.user', 'order.customer'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findOneForUser(id: number, user: { id: number; role?: string }) {
    const payment = await this.findOne(id);

    if (user.role === 'admin') {
      return payment;
    }

    const userId = Number(user.id);
    const ownsPayment =
      Number(payment.user?.id) === userId ||
      Number(payment.order?.user?.id) === userId ||
      Number(payment.order?.customer?.id) === userId;

    if (!ownsPayment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private async finalizeSuccessfulPayment(payment: Payment) {
    await this.earningsService.generateForSuccessfulPayment(
      payment.id,
      payment.order?.id,
    );
    const paidOrder = await this.ordersService.findOne(payment.order?.id);
    await this.notificationsService.createPurchaseThankYou(paidOrder);
  }
}

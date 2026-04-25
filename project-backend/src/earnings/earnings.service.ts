import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { PayoutStatus, SellerEarning } from './entities/seller-earning.entity';

const PLATFORM_COMMISSION_RATE = 0.1;

@Injectable()
export class EarningsService {
  constructor(
    @InjectRepository(SellerEarning)
    private readonly earningRepo: Repository<SellerEarning>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async generateForSuccessfulPayment(paymentId: number, orderId: number) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment || payment.status !== 'success') {
      return [];
    }

    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'items.product.seller'],
    });

    if (!order) {
      throw new NotFoundException('Order not found for earning generation');
    }

    const saleBySeller = new Map<number, number>();

    for (const item of order.items || []) {
      const sellerId = item.product?.seller?.id;
      if (!sellerId) continue;

      const itemTotal = Number(item.price) * Number(item.quantity);
      saleBySeller.set(sellerId, (saleBySeller.get(sellerId) || 0) + itemTotal);
    }

    const created: SellerEarning[] = [];

    for (const [sellerId, totalSale] of saleBySeller.entries()) {
      const exists = await this.earningRepo.findOne({
        where: {
          seller: { id: sellerId },
          order: { id: order.id },
          payment: { id: payment.id },
        },
      });

      if (exists) continue;

      const platformCommission = this.roundMoney(totalSale * PLATFORM_COMMISSION_RATE);
      const sellerAmount = this.roundMoney(totalSale - platformCommission);

      const earning = this.earningRepo.create({
        seller: { id: sellerId },
        order: { id: order.id },
        payment: { id: payment.id },
        totalSale: this.roundMoney(totalSale),
        platformCommission,
        sellerAmount,
        payoutStatus: PayoutStatus.PENDING,
      });

      created.push(await this.earningRepo.save(earning));
    }

    return created;
  }

  async findForSeller(sellerId: number) {
    const earnings = await this.earningRepo.find({
      where: { seller: { id: sellerId } },
      relations: ['order', 'payment'],
      order: { createdAt: 'DESC' },
    });

    return {
      summary: this.buildSummary(earnings),
      earnings,
    };
  }

  async findAllForAdmin() {
    const earnings = await this.earningRepo.find({
      relations: ['seller', 'order', 'payment'],
      order: { createdAt: 'DESC' },
    });

    return {
      summary: this.buildSummary(earnings),
      earnings,
    };
  }

  private buildSummary(earnings: SellerEarning[]) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return earnings.reduce(
      (summary, earning) => {
        const sellerAmount = Number(earning.sellerAmount) || 0;
        const createdAt = new Date(earning.createdAt);

        summary.totalEarning += sellerAmount;

        if (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        ) {
          summary.monthlyEarning += sellerAmount;
        }

        if (earning.payoutStatus === PayoutStatus.PAID) {
          summary.paidPayout += sellerAmount;
        } else {
          summary.pendingPayout += sellerAmount;
        }

        return summary;
      },
      {
        totalEarning: 0,
        monthlyEarning: 0,
        pendingPayout: 0,
        paidPayout: 0,
      },
    );
  }

  private roundMoney(value: number) {
    return Number(value.toFixed(2));
  }
}

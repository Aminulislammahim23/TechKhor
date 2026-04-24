import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';

type TrendBucket = {
  month?: string;
  day?: string;
  users?: number;
  orders?: number;
  revenue?: number;
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function monthKey(date: Date) {
  return date.toLocaleString('en-US', { month: 'short' });
}

function dayKey(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toNumber(value: unknown) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function percentageChange(current: number, previous: number) {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async getOverview() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = addMonths(currentMonthStart, -1);
    const sixMonthsAgo = addMonths(currentMonthStart, -5);
    const sevenDaysAgo = startOfDay(addDays(now, -6));
    const fourteenDaysAgo = startOfDay(addDays(now, -13));

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenueRaw,
      approvedProducts,
      pendingProducts,
      thisMonthUsers,
      lastMonthUsers,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthRevenueRaw,
      lastMonthRevenueRaw,
      recentUsers,
      recentOrders,
      recentPayments,
      products,
    ] = await Promise.all([
      this.userRepo.count(),
      this.productRepo.count(),
      this.orderRepo.count(),
      this.paymentRepo.sum('amount', { status: 'success' }),
      this.productRepo.count({ where: { isApproved: true } }),
      this.productRepo.count({ where: { isApproved: false } }),
      this.userRepo.count({ where: { createdAt: Between(currentMonthStart, now) } }),
      this.userRepo.count({ where: { createdAt: Between(previousMonthStart, currentMonthStart) } }),
      this.orderRepo.count({ where: { createdAt: Between(currentMonthStart, now) } }),
      this.orderRepo.count({ where: { createdAt: Between(previousMonthStart, currentMonthStart) } }),
      this.paymentRepo.sum('amount', { status: 'success', createdAt: Between(currentMonthStart, now) }),
      this.paymentRepo.sum('amount', { status: 'success', createdAt: Between(previousMonthStart, currentMonthStart) }),
      this.userRepo.find({
        select: { createdAt: true },
        where: { createdAt: Between(sevenDaysAgo, now) },
        order: { createdAt: 'ASC' },
      }),
      this.orderRepo.find({
        select: { createdAt: true },
        where: { createdAt: Between(sevenDaysAgo, now) },
        order: { createdAt: 'ASC' },
      }),
      this.paymentRepo.find({
        select: { amount: true, createdAt: true, status: true },
        where: { createdAt: Between(sevenDaysAgo, now) },
        order: { createdAt: 'ASC' },
      }),
      this.productRepo.find({
        select: { isApproved: true },
      }),
    ]);

    const monthlyRevenue = new Map<string, number>();
    const monthlyUsers = new Map<string, number>();
    const monthlyOrderTotals = new Map<string, number>();

    const monthSeries: string[] = [];
    for (let index = 0; index < 6; index += 1) {
      const date = addMonths(currentMonthStart, index - 5);
      monthSeries.push(monthKey(date));
      monthlyRevenue.set(monthKey(date), 0);
      monthlyUsers.set(monthKey(date), 0);
    }

    for (const payment of await this.paymentRepo.find({
      select: { amount: true, createdAt: true, status: true },
      where: { status: 'success', createdAt: Between(sixMonthsAgo, now) },
      order: { createdAt: 'ASC' },
    })) {
      const key = monthKey(new Date(payment.createdAt));
      monthlyRevenue.set(key, (monthlyRevenue.get(key) || 0) + toNumber(payment.amount));
    }

    for (const user of await this.userRepo.find({
      select: { createdAt: true },
      where: { createdAt: Between(sixMonthsAgo, now) },
      order: { createdAt: 'ASC' },
    })) {
      const key = monthKey(new Date(user.createdAt));
      monthlyUsers.set(key, (monthlyUsers.get(key) || 0) + 1);
    }

    for (const order of await this.orderRepo.find({
      select: { createdAt: true },
      where: { createdAt: Between(sevenDaysAgo, now) },
      order: { createdAt: 'ASC' },
    })) {
      const key = dayKey(new Date(order.createdAt));
      monthlyOrderTotals.set(key, (monthlyOrderTotals.get(key) || 0) + 1);
    }

    const orderSeries: string[] = [];
    for (let index = 0; index < 7; index += 1) {
      orderSeries.push(dayKey(addDays(sevenDaysAgo, index)));
    }

    const previousOrderSeries: string[] = [];
    for (let index = 0; index < 7; index += 1) {
      previousOrderSeries.push(dayKey(addDays(fourteenDaysAgo, index)));
    }

    const currentWeekRevenue = recentPayments
      .filter((payment) => payment.status === 'success')
      .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

    const thisMonthRevenue = toNumber(thisMonthRevenueRaw);
    const lastMonthRevenue = toNumber(lastMonthRevenueRaw);

    const previousWeekRevenue = (await this.paymentRepo.find({
      select: { amount: true, createdAt: true, status: true },
      where: { status: 'success', createdAt: Between(fourteenDaysAgo, sevenDaysAgo) },
      order: { createdAt: 'ASC' },
    })).reduce((sum, payment) => sum + toNumber(payment.amount), 0);

    const recentOrderBuckets = new Map<string, number>();
    for (const order of recentOrders) {
      const key = dayKey(new Date(order.createdAt));
      recentOrderBuckets.set(key, (recentOrderBuckets.get(key) || 0) + 1);
    }

    const previousOrderBuckets = new Map<string, number>();
    for (const order of await this.orderRepo.find({
      select: { createdAt: true },
      where: { createdAt: Between(fourteenDaysAgo, sevenDaysAgo) },
      order: { createdAt: 'ASC' },
    })) {
      const key = dayKey(new Date(order.createdAt));
      previousOrderBuckets.set(key, (previousOrderBuckets.get(key) || 0) + 1);
    }

    const revenueData = monthSeries.map((month) => ({
      month,
      revenue: Math.round(monthlyRevenue.get(month) || 0),
    }));

    const usersData = monthSeries.map((month) => ({
      month,
      users: monthlyUsers.get(month) || 0,
    }));

    const ordersData = orderSeries.map((day) => ({
      day,
      orders: recentOrderBuckets.get(day) || 0,
    }));

    const productStatusData = [
      { name: 'Approved', value: approvedProducts },
      { name: 'Pending', value: pendingProducts },
    ];

    const totalRevenue = Math.round(toNumber(totalRevenueRaw));

    return {
      cards: [
        {
          title: 'Total Users',
          value: totalUsers.toLocaleString('en-US'),
          change: `${percentageChange(thisMonthUsers, lastMonthUsers) >= 0 ? '+' : ''}${percentageChange(thisMonthUsers, lastMonthUsers).toFixed(1)}% this month`,
          accent: 'from-cyan-500/20 to-cyan-400/10 text-cyan-300',
        },
        {
          title: 'Total Products',
          value: totalProducts.toLocaleString('en-US'),
          change: `${percentageChange(approvedProducts, pendingProducts || 1) >= 0 ? '+' : ''}${percentageChange(approvedProducts, pendingProducts || 1).toFixed(1)}% approved ratio`,
          accent: 'from-emerald-500/20 to-emerald-400/10 text-emerald-300',
        },
        {
          title: 'Total Orders',
          value: totalOrders.toLocaleString('en-US'),
          change: `${percentageChange(thisMonthOrders, lastMonthOrders) >= 0 ? '+' : ''}${percentageChange(thisMonthOrders, lastMonthOrders).toFixed(1)}% this month`,
          accent: 'from-blue-500/20 to-blue-400/10 text-blue-300',
        },
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString('en-US')}`,
          change: `${percentageChange(thisMonthRevenue, lastMonthRevenue) >= 0 ? '+' : ''}${percentageChange(thisMonthRevenue, lastMonthRevenue).toFixed(1)}% this month`,
          accent: 'from-amber-500/20 to-amber-400/10 text-amber-300',
        },
      ],
      analyticsSummary: [
        {
          label: 'Weekly revenue',
          value: `$${Math.round(currentWeekRevenue).toLocaleString('en-US')}`,
        },
        {
          label: 'Weekly orders',
          value: recentOrders.length.toLocaleString('en-US'),
        },
        {
          label: 'New users',
          value: recentUsers.length.toLocaleString('en-US'),
        },
        {
          label: 'Payments',
          value: `${recentPayments.filter((payment) => payment.status === 'success').length.toLocaleString('en-US')} success`,
        },
      ],
      revenueData,
      ordersData,
      productStatusData,
      usersData,
      meta: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    };
  }
}

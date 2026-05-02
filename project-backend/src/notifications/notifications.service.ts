import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async createPurchaseThankYou(order: Order) {
    const recipientId = order.customer?.id || order.user?.id;

    if (!recipientId) {
      return null;
    }

    const items = (order.items || []).map((item) => ({
      name: item.product?.name || 'Product',
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));
    const itemSummary = items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ');
    const deliveryLabel =
      order.deliveryType === 'home_delivery'
        ? 'Home Delivery'
        : order.deliveryType === 'collect_store'
          ? 'Collect from store'
          : 'Standard order';

    const notification = this.notificationRepo.create({
      user: { id: recipientId },
      order: { id: order.id },
      title: 'Thank you for your purchase',
      message: `Thank you for your purchase. Order #${order.id} is confirmed. Details: ${itemSummary || 'No item details available'}. Total: BDT ${Number(order.totalPrice).toLocaleString('en-BD')}. Delivery: ${deliveryLabel}.`,
      type: 'order_thank_you',
      metadata: {
        orderId: order.id,
        totalPrice: Number(order.totalPrice),
        status: order.status,
        deliveryType: order.deliveryType,
        deliveryAddress: order.deliveryAddress,
        items,
      },
    });

    return this.notificationRepo.save(notification);
  }

  async createHomeDeliveryApprovalNotifications(order: Order) {
    if (order.deliveryType !== 'home_delivery') {
      return [];
    }

    const itemsBySeller = new Map<
      number,
      Array<{ name: string; quantity: number; price: number }>
    >();

    for (const item of order.items || []) {
      const sellerId = item.product?.seller?.id;
      if (!sellerId) continue;

      const sellerItems = itemsBySeller.get(sellerId) || [];
      sellerItems.push({
        name: item.product?.name || 'Product',
        quantity: Number(item.quantity),
        price: Number(item.price),
      });
      itemsBySeller.set(sellerId, sellerItems);
    }

    const notifications = Array.from(itemsBySeller.entries()).map(
      ([sellerId, items]) => {
        const itemSummary = items
          .map((item) => `${item.name} x${item.quantity}`)
          .join(', ');

        return this.notificationRepo.create({
          user: { id: sellerId },
          order: { id: order.id },
          title: 'Home delivery approval needed',
          message: `Home delivery order #${order.id} needs seller approval. Details: ${itemSummary}. Customer: ${order.customerName || 'N/A'} (${order.customerPhone || 'N/A'}). Address: ${order.deliveryAddress || 'N/A'}.`,
          type: 'home_delivery_approval',
          metadata: {
            orderId: order.id,
            totalPrice: Number(order.totalPrice),
            status: order.status,
            deliveryType: order.deliveryType,
            deliveryAddress: order.deliveryAddress,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            items,
          },
        });
      },
    );

    if (notifications.length === 0) {
      return [];
    }

    return this.notificationRepo.save(notifications);
  }

  async createPaymentApprovalNotifications(order: Order, paymentId: number) {
    const itemsBySeller = new Map<
      number,
      Array<{ name: string; quantity: number; price: number }>
    >();

    for (const item of order.items || []) {
      const sellerId = item.product?.seller?.id;
      if (!sellerId) continue;

      const sellerItems = itemsBySeller.get(sellerId) || [];
      sellerItems.push({
        name: item.product?.name || 'Product',
        quantity: Number(item.quantity),
        price: Number(item.price),
      });
      itemsBySeller.set(sellerId, sellerItems);
    }

    const notifications: Notification[] = [];

    for (const [sellerId, items] of itemsBySeller.entries()) {
      const existing = await this.notificationRepo.findOne({
        where: {
          user: { id: sellerId },
          type: 'payment_approval',
        },
      });
      const existingPaymentId = Number(existing?.metadata?.paymentId || 0);

      if (existingPaymentId === Number(paymentId)) {
        continue;
      }

        const itemSummary = items
          .map((item) => `${item.name} x${item.quantity}`)
          .join(', ');

        notifications.push(this.notificationRepo.create({
          user: { id: sellerId },
          order: { id: order.id },
          title: 'Payment approval request',
          message: `Payment request for order #${order.id} is pending seller approval. Details: ${itemSummary}. Customer: ${order.customerName || 'N/A'} (${order.customerPhone || 'N/A'}). Total: BDT ${Number(order.totalPrice).toLocaleString('en-BD')}.`,
          type: 'payment_approval',
          metadata: {
            paymentId,
            orderId: order.id,
            totalPrice: Number(order.totalPrice),
            status: order.status,
            deliveryType: order.deliveryType,
            deliveryAddress: order.deliveryAddress,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            items,
          },
        }));
    }

    if (notifications.length === 0) {
      return [];
    }

    return this.notificationRepo.save(notifications);
  }

  findMine(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async markRead(userId: number, id: number) {
    const notification = await this.notificationRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!notification) {
      return { updated: false };
    }

    notification.readAt = new Date();
    await this.notificationRepo.save(notification);

    return { updated: true };
  }

  async markAllRead(userId: number) {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ readAt: new Date() })
      .where('"userId" = :userId', { userId })
      .andWhere('readAt IS NULL')
      .execute();

    return { updated: true };
  }
}

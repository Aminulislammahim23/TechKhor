import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';

export enum OrderStatus {
  PENDING = 'pending',           // Order placed, awaiting payment
  PAID = 'paid',                 // Payment received
  PROCESSING = 'processing',     // Order being prepared
  SHIPPED = 'shipped',           // Order shipped
  DELIVERED = 'delivered',       // Order delivered
  CANCELLED = 'cancelled',       // Order cancelled
  REFUNDED = 'refunded'          // Order refunded
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  shippingAddress?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, user => user.orders, { nullable: false })
  customer: Users;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];

  // @OneToMany type imported in customer.module.ts to avoid circular dependency
  trackingHistory: any[];
}

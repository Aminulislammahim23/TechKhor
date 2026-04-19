import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Users } from '../../users/entities/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',           // Payment initiated
  COMPLETED = 'completed',       // Payment successful
  FAILED = 'failed',             // Payment failed
  CANCELLED = 'cancelled',       // Payment cancelled
  REFUNDED = 'refunded'          // Payment refunded
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CARD
  })
  method: PaymentMethod;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  paymentGatewayResponse?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  referenceNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Order, order => order.payments, { nullable: false })
  order: Order;

  @ManyToOne(() => Users, user => user.id, { nullable: false })
  processedBy: Users; // Admin who verified the payment
}

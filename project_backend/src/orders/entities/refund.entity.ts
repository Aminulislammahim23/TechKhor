import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Users } from '../../users/entities/user.entity';
import { Payment } from './payment.entity';

export enum RefundStatus {
  REQUESTED = 'requested',       // Refund requested by customer
  APPROVED = 'approved',         // Refund approved by admin
  PROCESSING = 'processing',     // Refund being processed
  COMPLETED = 'completed',       // Refund completed
  REJECTED = 'rejected'          // Refund rejected by admin
}

export enum RefundReason {
  PRODUCT_DEFECTIVE = 'product_defective',
  WRONG_ITEM = 'wrong_item',
  NOT_AS_DESCRIBED = 'not_as_described',
  DELIVERY_ISSUE = 'delivery_issue',
  CUSTOMER_CHANGE_OF_MIND = 'customer_change_of_mind',
  OTHER = 'other'
}

@Entity()
export class Refund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.REQUESTED
  })
  status: RefundStatus;

  @Column({
    type: 'enum',
    enum: RefundReason,
    default: RefundReason.OTHER
  })
  reason: RefundReason;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  adminNotes?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  refundTransactionId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, order => order.id, { nullable: false })
  order: Order;

  @ManyToOne(() => Users, user => user.id, { nullable: false })
  requestedBy: Users; // Customer who requested refund

  @ManyToOne(() => Users, user => user.id, { nullable: true })
  processedBy?: Users; // Admin who processed the refund

  @ManyToOne(() => Payment, payment => payment.id, { nullable: true })
  originalPayment?: Payment; // Original payment being refunded
}

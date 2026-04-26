import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { User } from '../../users/entities/user.entity';

export enum PayoutStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity()
@Index(['seller', 'order', 'payment'], { unique: true })
export class SellerEarning {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  seller: User;

  @ManyToOne(() => Order, { nullable: false })
  order: Order;

  @ManyToOne(() => Payment, { nullable: false })
  payment: Payment;

  @Column('decimal', { precision: 12, scale: 2 })
  totalSale: number;

  @Column('decimal', { precision: 12, scale: 2 })
  platformCommission: number;

  @Column('decimal', { precision: 12, scale: 2 })
  sellerAmount: number;

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  payoutStatus: PayoutStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

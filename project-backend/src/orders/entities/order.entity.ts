import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User, { nullable: true })
  customer: User | null;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @Column()
  totalPrice: number;

  @Column()
  status: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string | null;

  @Column({ type: 'varchar', nullable: true })
  customerPhone: string | null;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  customerDiscountAmount: number;

  @Column('decimal', { precision: 5, scale: 4, default: 0 })
  customerDiscountRate: number;

  @CreateDateColumn()
  createdAt: Date;
}

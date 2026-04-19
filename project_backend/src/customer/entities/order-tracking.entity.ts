import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatus } from '../../orders/entities/order.entity';

@Entity()
export class OrderTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus
  })
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Order, order => order.trackingHistory, { nullable: false, onDelete: 'CASCADE' })
  order: Order;
}
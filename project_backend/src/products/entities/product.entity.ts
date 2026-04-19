import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Category } from './category.entity';

export enum ProductStatus {
  PENDING = 'pending',          // Awaiting admin review
  APPROVED = 'approved',        // Approved by admin
  REJECTED = 'rejected',        // Rejected by admin
  REMOVED = 'removed'           // Removed for being fake/low quality
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToOne(() => Category, category => category.products, { nullable: true, onDelete: 'SET NULL' })
  category?: Category;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING
  })
  status: ProductStatus;

  @ManyToOne(() => Users, user => user.products, { nullable: false })
  seller: Users;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

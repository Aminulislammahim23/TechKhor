import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum MessageType {
  CUSTOMER_TO_SELLER = 'customer_to_seller',
  SELLER_TO_CUSTOMER = 'seller_to_customer',
  PRODUCT_QUESTION = 'product_question',
  PRODUCT_ANSWER = 'product_answer'
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.CUSTOMER_TO_SELLER
  })
  type: MessageType;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users, { nullable: false })
  sender: Users;

  @ManyToOne(() => Users, { nullable: false })
  receiver: Users;

  @ManyToOne(() => Product, { nullable: true })
  product?: Product;
}
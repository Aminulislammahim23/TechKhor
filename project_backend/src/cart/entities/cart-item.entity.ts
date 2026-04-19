import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice?: number;

  @ManyToOne(() => Cart, cart => cart.cartItems, { nullable: false, onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;
}

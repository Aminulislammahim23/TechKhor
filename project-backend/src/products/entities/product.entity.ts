import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column({ default: false })
  isOffer: boolean;

  @Column('decimal', { nullable: true })
  offerPrice: number | null;

  @Column()
  stock: number;

  @Column({ default: false })
  isApproved: boolean;

  // 🖼️ NEW (image support)
  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  // ⭐ NEW (rating system future use)
  @Column({ default: 0 })
  rating: number;

  // 🔍 NEW (search optimization)
  @Column({ nullable: true })
  tags: string;

  @Column({ type: 'simple-json', nullable: true })
  keyFeatures: string[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  seller: User;

  @ManyToOne(() => Category)
  category: Category;
}

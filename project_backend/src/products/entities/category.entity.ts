import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false 
  })
  name: string;

  @Column({ 
    type: 'text', 
    nullable: true 
  })
  description?: string;

  @Column({ 
    type: 'varchar',
    length: 255,
    nullable: true 
  })
  image?: string;

  @OneToMany(() => Product, product => product.category, { onDelete: 'SET NULL' })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

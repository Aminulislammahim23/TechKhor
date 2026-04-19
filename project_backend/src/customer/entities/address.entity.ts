import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/user.entity';

export enum AddressType {
  HOME = 'home',
  OFFICE = 'office',
  OTHER = 'other'
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  label: string; // "Home", "Office", etc.

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.HOME
  })
  type: AddressType;

  @Column({ length: 255 })
  streetAddress: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 20 })
  zipCode: string;

  @Column({ length: 2 })
  country: string;

  @Column({ length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users, user => user.addresses, { nullable: false })
  customer: Users;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryCharge: number;

  @Column('decimal', { precision: 5, scale: 2, default: 10 })
  sellerCommission: number; // Percentage

  @Column({ default: true })
  isDeliveryChargeEnabled: boolean;

  @Column({ default: true })
  isCommissionEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Users } from '../../users/entities/user.entity';

export enum WithdrawStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

@Entity()
export class WithdrawRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({
    type: 'enum',
    enum: WithdrawStatus,
    default: WithdrawStatus.PENDING
  })
  status: WithdrawStatus;

  @Column({ type: 'text', nullable: true })
  adminNote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users, user => user.withdrawRequests, { nullable: false })
  seller: Users;
}
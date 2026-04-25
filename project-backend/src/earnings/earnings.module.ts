import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';
import { SellerEarning } from './entities/seller-earning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerEarning, Order, Payment])],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}

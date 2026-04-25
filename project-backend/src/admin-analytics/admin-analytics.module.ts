import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AdminAnalyticsService } from './admin-analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Payment])],
  controllers: [AdminAnalyticsController],
  providers: [AdminAnalyticsService],
})
export class AdminAnalyticsModule {}

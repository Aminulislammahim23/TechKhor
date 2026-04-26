import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from '../orders/orders.module';
import { Payment } from './entities/payment.entity';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    OrdersModule,
    EarningsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

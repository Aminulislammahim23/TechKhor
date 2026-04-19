import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Category } from '../products/entities/category.entity';
import { Users } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { WithdrawRequest } from './entities/withdraw-request.entity';
import { Message } from './entities/message.entity';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Users,
      Order,
      OrderItem,
      WithdrawRequest,
      Message,
    ]),
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Users } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../products/entities/category.entity';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../orders/entities/payment.entity';
import { Refund } from '../orders/entities/refund.entity';
import { Coupon } from './entities/coupon.entity';
import { SystemSettings } from './entities/system-settings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Users,
        Product,
        Category,
        Order,
        Payment,
        Refund,
        Coupon,
        SystemSettings
    ])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule {}

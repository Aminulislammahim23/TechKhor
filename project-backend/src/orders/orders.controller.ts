import {
  Controller, Post, Get,
  Req, UseGuards, Body, Param, ParseIntPipe
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() body: CreateOrderDto,
  ) {
    if (Array.isArray(body?.items) && body.items.length > 0) {
      return this.service.createFromItems(req.user, body.items, {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        deliveryType: body.deliveryType,
        deliveryAddress: body.deliveryAddress,
      });
    }

    return this.service.createFromCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('from-cart')
  async createFromCart(@Req() req) {
    return this.service.createFromCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async myOrders(@Req() req) {
    return this.service.findMyOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myOrdersAlias(@Req() req) {
    return this.service.findMyOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel-request')
  async requestCancel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.requestCancel(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Get('seller/cancel-requests')
  async findSellerCancelRequests(@Req() req) {
    return this.service.findSellerCancelRequests(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Post(':id/accept-cancel')
  async acceptCancel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.acceptCancel(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  async findAllForAdmin() {
    return this.service.findAllForAdmin();
  }
}

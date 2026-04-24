import {
  Controller, Post, Get,
  Req, UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req) {
    return this.service.createFromCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async myOrders(@Req() req) {
    return this.service.findMyOrders(req.user.id);
  }
}
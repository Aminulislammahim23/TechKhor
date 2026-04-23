import {
  Controller, Post, Get,
  Body, Req, UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { Order } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req): Order {
    return this.service.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  myOrders(@Req() req): Order[] {
    return this.service.findMyOrders(req.user.id);
  }
}
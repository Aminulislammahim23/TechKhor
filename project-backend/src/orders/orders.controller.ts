import {
  Controller, Post, Get,
  Req, UseGuards, Body
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() body: { items?: Array<{ productId: number; quantity: number }> }) {
    if (Array.isArray(body?.items) && body.items.length > 0) {
      return this.service.createFromItems(req.user.id, body.items);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  async findAllForAdmin() {
    return this.service.findAllForAdmin();
  }
}

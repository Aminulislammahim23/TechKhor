import {
  Controller, Post, Get,
  Body, Req, UseGuards
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() dto: AddToCartDto, @Req() req) {
    return this.service.add(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Req() req) {
    return this.service.getCart(req.user.id);
  }
}
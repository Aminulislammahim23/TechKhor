import {
  Controller, Post, Get,
  Body, Req, UseGuards
} from '@nestjs/common';
import { CartService } from './cart.service';
import type { CartItem } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  add(@Body() dto: AddToCartDto, @Req() req): CartItem {
    return this.service.add(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Req() req): CartItem[] {
    return this.service.getCart(req.user.id);
  }
}
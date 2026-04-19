import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/jwt/jwtGuard.guard';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    return await this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  async addToCart(
    @Body() body: { productId: number; quantity: number },
    @Request() req,
  ) {
    return await this.cartService.addToCart(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  @Put('item/:cartItemId')
  async updateCartItem(
    @Param('cartItemId') cartItemId: number,
    @Body() body: { quantity: number },
    @Request() req,
  ) {
    return await this.cartService.updateCartItem(
      req.user.userId,
      cartItemId,
      body.quantity,
    );
  }

  @Delete('item/:cartItemId')
  async removeFromCart(
    @Param('cartItemId') cartItemId: number,
    @Request() req,
  ) {
    await this.cartService.removeFromCart(req.user.userId, cartItemId);
    return { message: 'Item removed from cart' };
  }

  @Delete('clear')
  async clearCart(@Request() req) {
    await this.cartService.clearCart(req.user.userId);
    return { message: 'Cart cleared' };
  }
}

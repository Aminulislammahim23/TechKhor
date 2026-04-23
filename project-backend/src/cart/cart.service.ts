import { Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';

export interface CartItem extends AddToCartDto {
  userId: number;
}

@Injectable()
export class CartService {
  private cartItems: CartItem[] = [];

  add(userId: number, dto: AddToCartDto) {
    const item: CartItem = {
      userId,
      ...dto,
    };
    this.cartItems.push(item);
    return item;
  }

  getCart(userId: number) {
    return this.cartItems.filter(i => i.userId === userId);
  }
}
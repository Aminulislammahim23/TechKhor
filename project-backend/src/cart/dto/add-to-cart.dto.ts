import { IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}
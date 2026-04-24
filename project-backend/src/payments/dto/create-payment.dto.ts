import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  amount: number;

  @IsString()
  method: string; // mock / stripe / sslcommerz
}
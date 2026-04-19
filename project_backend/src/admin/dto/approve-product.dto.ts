import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class ApproveProductDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    productId: number;
}

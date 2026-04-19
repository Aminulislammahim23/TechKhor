import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class ApproveSellerDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    sellerId: number;
}

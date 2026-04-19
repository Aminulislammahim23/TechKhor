import { IsNumber, IsNotEmpty, IsPositive, IsString, IsOptional } from 'class-validator';

export class RejectProductDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    productId: number;

    @IsString()
    @IsOptional()
    reason?: string;
}

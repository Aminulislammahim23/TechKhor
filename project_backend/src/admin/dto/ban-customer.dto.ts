import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class BanCustomerDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    customerId: number;
}

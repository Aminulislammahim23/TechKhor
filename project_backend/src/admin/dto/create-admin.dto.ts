import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAdminDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;
}

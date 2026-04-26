import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../../users/entities/user.entity';

export class LoginDto {
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;
}
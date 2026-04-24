import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { Role } from "../entities/user.entity";


export class CreateUserDto {
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
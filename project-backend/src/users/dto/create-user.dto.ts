import { IsEmail, IsNotEmpty, IsEnum } from "class-validator";
import { Role } from "../entities/user.entity";


export class CreateUserDto {
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;
}
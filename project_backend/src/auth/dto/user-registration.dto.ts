import { IsEmail, IsNotEmpty, IsEnum } from "class-validator";
import { Role } from "../../users/entities/user.entity";

export class UserRegistrationDto {
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;
}

import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    image?: string;
}

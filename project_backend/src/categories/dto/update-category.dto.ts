import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @Length(1, 100)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    image?: string;
}

import { IsString, IsNumber, IsOptional, IsArray, Min, Max, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comment?: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  orderId?: number;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comment?: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}
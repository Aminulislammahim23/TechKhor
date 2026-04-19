import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsNumber()
  receiverId: number;
}

export class ReplyMessageDto {
  @IsString()
  content: string;
}
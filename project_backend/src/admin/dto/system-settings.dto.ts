import { IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class UpdateSystemSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryCharge?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sellerCommission?: number;

  @IsOptional()
  @IsBoolean()
  isDeliveryChargeEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isCommissionEnabled?: boolean;
}
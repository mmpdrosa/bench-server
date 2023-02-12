import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  retailer: string;

  @IsOptional()
  @IsString()
  store?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

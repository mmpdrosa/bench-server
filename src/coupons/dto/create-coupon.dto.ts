import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  discount: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  minimum_spend?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  store?: string;

  @IsNotEmpty()
  @IsString()
  retailer_id: string;
}

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class AssignRetailerDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  store?: string;

  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @IsNotEmpty()
  @IsString()
  html_url: string;

  @IsOptional()
  @IsString()
  dummy?: string;

  @IsOptional()
  @IsString()
  coupon_id?: string;
}

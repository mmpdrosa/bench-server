import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  retailer: string;

  @IsNotEmpty()
  @IsString()
  store: string;

  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @IsNotEmpty()
  @IsString()
  html_url: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  dummy?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  subcategory_id?: string;

  @IsOptional()
  @IsString()
  coupon_id?: string;
}

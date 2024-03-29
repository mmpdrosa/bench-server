import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsNotEmpty()
  @IsString()
  html_url: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  specs?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;

  @IsOptional()
  @IsString()
  coupon?: string;

  @IsOptional()
  @IsString()
  product_id?: string;

  @IsOptional()
  @IsString()
  label?: string;
}

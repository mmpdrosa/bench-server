import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  reference_price?: number;

  @IsOptional()
  @IsBoolean()
  recommended?: boolean;

  @IsOptional()
  specs?: string;

  @IsOptional()
  @IsString()
  review_url?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  subcategory_id?: string;
}

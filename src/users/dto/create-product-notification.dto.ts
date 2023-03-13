import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductNotificationDto {
  @IsInt()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}

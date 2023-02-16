import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ToogleProductNotificationDto {
  @IsInt()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}

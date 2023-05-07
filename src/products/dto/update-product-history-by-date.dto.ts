import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateProductHistoryByDateDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;
}

import { IsDateString, IsNotEmpty } from 'class-validator';

export class RemoveProductHistoryByDateDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

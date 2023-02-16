import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRetailerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  html_url: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class AssignCategoryDto {
  @IsNotEmpty()
  @IsString()
  category_id: string;
}

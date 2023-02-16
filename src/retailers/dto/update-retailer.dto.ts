import { PartialType } from '@nestjs/swagger';
import { CreateRetailerDto } from './create-retailer.dto';

export class UpdateRetailerDto extends PartialType(CreateRetailerDto) {}

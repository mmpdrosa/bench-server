import { PartialType } from '@nestjs/mapped-types';
import { AssignRetailerDto } from './assign-retailer.dto';

export class UpdateProductRetailerDto extends PartialType(AssignRetailerDto) {}

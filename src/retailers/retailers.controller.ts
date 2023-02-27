import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateRetailerDto } from './dto/create-retailer.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';
import { RetailersService } from './retailers.service';

@Controller('retailers')
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  @Post()
  create(@Body() createRetailerDto: CreateRetailerDto) {
    return this.retailersService.create(createRetailerDto);
  }

  @Get()
  findAll() {
    return this.retailersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.retailersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRetailerDto: UpdateRetailerDto,
  ) {
    return this.retailersService.update(id, updateRetailerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.retailersService.remove(id);
  }

  @Get(':retailer_id/products')
  findAllProducts(@Param('retailer_id', ParseUUIDPipe) retailer_id: string) {
    return this.retailersService.findAllProducts(retailer_id);
  }

  @Get(':retailer_id/coupons')
  findAllCoupons(@Param('retailer_id', ParseUUIDPipe) retailer_id: string) {
    return this.retailersService.findAllCoupons(retailer_id);
  }
}

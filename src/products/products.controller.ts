import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AssignRetailerDto } from './dto/assign-retailer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductRetailerDto } from './dto/update-product-retailer.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Post(':product_id/retailers/:retailer_id')
  assignRetailer(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Param('retailer_id', ParseUUIDPipe) retailer_id: string,
    @Body() assignRetailerDto: AssignRetailerDto,
  ) {
    return this.productsService.assignRetailer(
      product_id,
      retailer_id,
      assignRetailerDto,
    );
  }

  @Get(':product_id/retailers')
  findAllRetailers(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return this.productsService.findAllRetailers(product_id);
  }

  @Patch(':product_id/retailers/:retailer_id')
  updateProductRetailerRelation(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Param('retailer_id', ParseUUIDPipe) retailer_id: string,
    @Body() updateProductRetailerDto: UpdateProductRetailerDto,
  ) {
    return this.productsService.updateProductRetailerRelation(
      product_id,
      retailer_id,
      updateProductRetailerDto,
    );
  }

  @Get('with-min-price/for-all')
  findProductsWithMinPrice(
    @Query('search') search = 'all',
    @Query('category') category = 'all',
    @Query('subcategory') subcategory = 'all',
    @Query('order') order = 'default',
    @Query('skip') skip,
    @Query('take') take,
  ) {
    return this.productsService.findProductsWithMinPrice(
      search,
      category,
      subcategory,
      order,
      skip,
      take,
    );
  }

  @Get(':product_id/with-min-price')
  findProductWithMinPrice(
    @Param('product_id', ParseUUIDPipe) product_id: string,
  ) {
    return this.productsService.findProductWithMinPrice(product_id);
  }

  @Get(':product_id/price-history')
  findProductPriceHistory(
    @Param('product_id', ParseUUIDPipe) product_id: string,
  ) {
    return this.productsService.findProductPriceHistory(product_id);
  }

  @Delete(':product_id/retailers/:retailer_id')
  removeProductRetailerRelation(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Param('retailer_id', ParseUUIDPipe) retailer_id: string,
  ) {
    return this.productsService.removeProductRetailerRelation(
      product_id,
      retailer_id,
    );
  }

  @Get(':product_id/sales')
  findAllSales(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return this.productsService.findAllSales(product_id);
  }
}

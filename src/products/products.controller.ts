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
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { ApiKeyInterceptor } from 'src/api-key.interceptor';
import { AssignRetailerDto } from './dto/assign-retailer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductRetailerDto } from './dto/update-product-retailer.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductHistoryByDateDto } from './dto/update-product-history-by-date.dto';
import { RemoveProductHistoryByDateDto } from './dto/remove-product-history-by-date.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
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
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Post(':product_id/retailers/:retailer_id')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
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
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
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

  @Patch(':product_id/price-history')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  updateProductHistoryByDate(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Body() updateProductHistoryByDateDto: UpdateProductHistoryByDateDto,
  ) {
    const { date, price } = updateProductHistoryByDateDto;
    return this.productsService.updateProductHistoryByDate(
      product_id,
      date,
      price,
    );
  }

  @Delete(':product_id/price-history')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  removeProductHistoryByDate(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Body() removeProductHistoryByDateDto: RemoveProductHistoryByDateDto,
  ) {
    const { date } = removeProductHistoryByDateDto;
    return this.productsService.removeProductHistoryByDate(product_id, date);
  }

  @Delete(':product_id/retailers/:retailer_id')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
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

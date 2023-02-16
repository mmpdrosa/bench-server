import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':product_id/retailers/retailer_id')
  assignRetailer(
    @Param('product_id') product_id: string,
    @Param('retailer_id') retailer_id: string,
    @Body() assignRetailerDto: AssignRetailerDto,
  ) {
    return this.productsService.assignRetailer(
      product_id,
      retailer_id,
      assignRetailerDto,
    );
  }

  @Get(':product_id/retailers')
  findAllRetailers(@Param('product_id') product_id: string) {
    return this.productsService.findAllRetailers(product_id);
  }

  @Patch(':product_id/retailers/:retailer_id')
  updateProductRetailerRelation(
    @Param('product_id') product_id: string,
    @Param('retailer_id') retailer_id: string,
    @Body() updateProductRetailerDto: UpdateProductRetailerDto,
  ) {
    return this.productsService.updateProductRetailerRelation(
      product_id,
      retailer_id,
      updateProductRetailerDto,
    );
  }

  @Get('with-min-price/for-all')
  findProductsWithMinPrice() {
    return this.productsService.findProductsWithMinPrice();
  }

  @Delete(':product_id/retailers/:retailer_id')
  removeProductRetailerRelation(
    @Param('product_id') product_id: string,
    @Param('retailer_id') retailer_id: string,
  ) {
    return this.productsService.removeProductRetailerRelation(
      product_id,
      retailer_id,
    );
  }
}

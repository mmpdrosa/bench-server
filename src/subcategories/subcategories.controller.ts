import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { ApiKeyInterceptor } from 'src/api-key.interceptor';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subcategoriesService.remove(id);
  }
}

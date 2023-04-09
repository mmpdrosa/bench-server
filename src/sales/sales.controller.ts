import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';
import { CreateSaleReactionDto } from './dto/create-sale-reaction.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(
    @Query('search') search = 'all',
    @Query('skip', ParseIntPipe) skip,
    @Query('take', ParseIntPipe) take,
  ) {
    return this.salesService.findAll(search, skip, take);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.remove(id);
  }

  @Post(':sale_id/reactions')
  createReaction(
    @Req() req,
    @Param('sale_id', ParseUUIDPipe) sale_id: string,
    @Body() createSaleReactionDto: CreateSaleReactionDto,
  ) {
    const { id: user_id } = req['user'];

    return this.salesService.createReaction(
      user_id,
      sale_id,
      createSaleReactionDto,
    );
  }

  @Delete(':sale_id/reactions/:content')
  removeReaction(
    @Req() req,
    @Param('sale_id', ParseUUIDPipe) sale_id: string,
    @Param('content') content: string,
  ) {
    const { id: user_id } = req['user'];

    return this.salesService.removeReaction(user_id, sale_id, content);
  }
}

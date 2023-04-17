import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { ApiKeyInterceptor } from 'src/api-key.interceptor';
import { CreateProductNotificationDto } from './dto/create-product-notification.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Req() req) {
    const { id } = req['user'];

    return this.usersService.remove(id);
  }

  @Patch(':id/make-admin')
  @UseInterceptors(ApiKeyInterceptor)
  @ApiSecurity('api-key')
  makeUserAdmin(@Param('id') id: string) {
    return this.usersService.makeUserAdmin(id);
  }

  @Get('role/admin')
  verifyUserAdmin(@Req() req) {
    const { role } = req['user'];

    return role === 'admin';
  }

  @Post('notify-product/:product_id')
  notifyProduct(
    @Req() req,
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Body() createProductNotificationDto: CreateProductNotificationDto,
  ) {
    const { id: user_id } = req['user'];

    return this.usersService.notifyProduct(
      user_id,
      product_id,
      createProductNotificationDto,
    );
  }

  @Get('product-notifications/for-all')
  findAllUserProductNotifications(@Req() req) {
    const { id: user_id } = req['user'];

    return this.usersService.findAllUserProductNotifications(user_id);
  }

  @Delete('unnotify-product/:product_id')
  unnotifyProduct(
    @Req() req,
    @Param('product_id', ParseUUIDPipe) product_id: string,
  ) {
    const { id: user_id } = req['user'];

    return this.usersService.unnotifyProduct(user_id, product_id);
  }

  @Post('toggle-category-notification/:category_id')
  toggleCategoryNotification(
    @Req() req,
    @Param('category_id', ParseUUIDPipe) category_id: string,
  ) {
    const { id: user_id } = req['user'];

    return this.usersService.toggleCategoryNotification(user_id, category_id);
  }

  @Get('category-notifications/for-all')
  findAllUserCategoryNotifications(@Req() req) {
    const { id: user_id } = req['user'];

    return this.usersService.findAllUserCategoryNotifications(user_id);
  }

  @Get('sales-reactions/for-all')
  findAllUserSalesReactions(@Req() req) {
    const { id: user_id } = req['user'];

    return this.usersService.findAllUserSalesReactions(user_id);
  }
}

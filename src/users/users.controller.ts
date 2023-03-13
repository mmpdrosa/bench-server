import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
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
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
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
}

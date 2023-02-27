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

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ToogleProductNotificationDto } from './dto/toogle-product-notification.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Req() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    const { id } = req['user'];

    return this.subscriptionsService.create(id, createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Delete()
  remove(@Req() req) {
    const { id } = req['user'];

    return this.subscriptionsService.removeByUserId(id);
  }

  @Get()
  publicKey() {
    return this.subscriptionsService.publicKey();
  }

  @Post('toogle-product/:product_id')
  toogleProduct(
    @Req() req,
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Body() toogleProductNotificationDto: ToogleProductNotificationDto,
  ) {
    const { id: user_id } = req['user'];

    return this.subscriptionsService.toogleProduct(
      user_id,
      product_id,
      toogleProductNotificationDto,
    );
  }
}

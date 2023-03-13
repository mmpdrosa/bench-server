import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
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

  @Get('public-key')
  publicKey() {
    return this.subscriptionsService.publicKey();
  }
}

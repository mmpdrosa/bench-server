import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';

import { ApiKeyInterceptor } from 'src/api-key.interceptor';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('public-key')
  publicKey() {
    return this.subscriptionsService.publicKey();
  }

  @Post()
  create(@Req() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    const { id } = req['user'];

    return this.subscriptionsService.create(id, createSubscriptionDto);
  }

  @Get()
  @UseInterceptors(ApiKeyInterceptor)
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Delete()
  remove(@Req() req) {
    const { id } = req['user'];

    return this.subscriptionsService.removeByUserId(id);
  }
}

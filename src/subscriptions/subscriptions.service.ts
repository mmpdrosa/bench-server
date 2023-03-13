import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async publicKey() {
    return process.env.PUBLIC_VAPID_KEY;
  }

  async create(user_id: string, createSubscriptionDto: CreateSubscriptionDto) {
    const { endpoint, keys } = createSubscriptionDto;

    const subscription = await this.prisma.subscription.create({
      data: { user_id, endpoint, keys: JSON.stringify(keys) },
    });

    return {
      id: subscription.id,
      user_id: subscription.user_id,
      endpoint: subscription.endpoint,
      keys: JSON.parse(subscription.keys as string),
    };
  }

  async findAll() {
    const subscriptions = await this.prisma.subscription.findMany();

    return subscriptions.map((subscription) => {
      const keys = JSON.parse(subscription.keys as string);

      return {
        ...subscription,
        keys,
      };
    });
  }

  async removeByUserId(id: string) {
    return this.prisma.subscription.deleteMany({ where: { user_id: id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { endpoint, keys } = createSubscriptionDto;

    const subscription = await this.prisma.subscription.create({
      data: { endpoint, keys: JSON.stringify(keys) },
    });

    return {
      id: subscription.id,
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

  async findOne(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return {};
    }

    return {
      ...subscription,
      keys: JSON.parse(subscription.keys as string),
    };
  }

  remove(id: string) {
    return this.prisma.subscription.delete({ where: { id } });
  }
}

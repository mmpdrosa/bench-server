import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import webpush from 'web-push';

import { priceFormatter } from '../utils/formatter';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  private async sendCategoryNotification(
    category_id: string,
    categoryName: string,
    productTitle: string,
    productPrice: number,
  ) {
    const usersCategoryNotification =
      await this.prisma.userCategoryNotification.findMany({
        where: { category_id },
      });

    const notificationPromises = usersCategoryNotification.map(
      async ({ user_id }) => {
        const userSubscriptions = await this.prisma.subscription.findMany({
          where: { user_id },
        });

        return Promise.allSettled(
          userSubscriptions.map(({ endpoint, keys }) => {
            const pushSubscription = {
              endpoint,
              keys: JSON.parse(keys as string),
            };

            const notificationPayload = {
              title: `Promoção em ${categoryName}!`,
              body: `Aproveite o desconto em ${productTitle} por apenas ${priceFormatter.format(
                productPrice / 100,
              )}. Corra e compre já!`,
              data: {
                url: `${process.env.WEB_URL}/sales`,
              },
            };

            return webpush.sendNotification(
              pushSubscription,
              JSON.stringify(notificationPayload),
            );
          }),
        );
      },
    );

    await Promise.allSettled(notificationPromises);
  }

  async create(createSaleDto: CreateSaleDto) {
    const sale = await this.prisma.sale.create({
      data: createSaleDto,
      include: { category: true },
    });

    await this.sendCategoryNotification(
      sale.category_id,
      sale.category.name,
      sale.title,
      sale.price,
    );

    return sale;
  }

  findAll(search: string) {
    const where = { AND: [] };

    if (search !== 'all') {
      const words = search.trim().split(/\s+/).filter(Boolean);

      where.AND = words.map((word) => ({
        title: { contains: word, mode: 'insensitive' },
      }));
    }

    return this.prisma.sale.findMany({
      where,
      include: { category: true },
      orderBy: { created_at: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.sale.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateSaleDto: UpdateSaleDto) {
    return this.prisma.sale.update({ where: { id }, data: updateSaleDto });
  }

  remove(id: string) {
    return this.prisma.sale.delete({ where: { id } });
  }
}

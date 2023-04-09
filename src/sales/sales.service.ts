import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import webpush from 'web-push';

import { priceFormatter } from '../utils/formatter';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { CreateSaleReactionDto } from './dto/create-sale-reaction.dto';

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
                url: `/sales`,
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

  async findAll(search: string, skip: number, take: number) {
    const where = { AND: [] };

    if (search !== 'all') {
      const words = search.trim().split(/\s+/).filter(Boolean);

      where.AND = words.map((word) => ({
        title: { contains: word, mode: 'insensitive' },
      }));
    }

    const totalCount = await this.prisma.sale.count({ where });

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { created_at: 'desc' },
      skip,
      take,
    });

    const reactions = await this.prisma.saleReaction.groupBy({
      by: ['sale_id', 'content'],
      _count: { content: true },
    });

    const reactionsMap = new Map();

    reactions.forEach(({ sale_id, content, _count }) => {
      if (reactionsMap.has(sale_id)) {
        reactionsMap.get(sale_id)[content] = _count.content;
      } else {
        reactionsMap.set(sale_id, { [content]: _count.content });
      }
    });

    const salesWithReactions = sales.map((sale) => ({
      ...sale,
      reactions: reactionsMap.get(sale.id) || null,
    }));

    return {
      totalCount,
      sales: salesWithReactions,
    };
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

  createReaction(
    user_id: string,
    sale_id: string,
    createSaleReactionDto: CreateSaleReactionDto,
  ) {
    return this.prisma.saleReaction.create({
      data: {
        user_id,
        sale_id,
        ...createSaleReactionDto,
      },
    });
  }

  removeReaction(user_id: string, sale_id: string, content: string) {
    return this.prisma.saleReaction.deleteMany({
      where: { user_id, sale_id, content },
    });
  }
}

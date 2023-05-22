import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'nestjs-prisma';
import webpush from 'web-push';

import { priceFormatter } from '../utils/formatter';
import { AssignRetailerDto } from './dto/assign-retailer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductRetailerDto } from './dto/update-product-retailer.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private mapWithCategoryAndSubcategory(product) {
    const { productCategory, productSubcategory, ...data } = product;
    const category = productCategory?.category ?? null;
    const subcategory = productSubcategory?.subcategory ?? null;
    return { ...data, category, subcategory };
  }

  public async updateProductDailyPrice(
    product_id: string,
    available: boolean,
    price: number,
    isPriceFromSale: boolean,
  ) {
    const today = dayjs().tz().startOf('day');

    const todayRegister = await this.prisma.productPriceHistory.findFirst({
      where: {
        product_id,
        date: { equals: today.toDate() },
      },
      orderBy: { date: 'desc' },
    });

    if (todayRegister) {
      await this.prisma.productPriceHistory.update({
        where: { id: todayRegister.id },
        data: {
          last_availability: available,
          was_available: todayRegister.was_available ? true : available,
          lowest_price:
            todayRegister.lowest_price > price
              ? price
              : todayRegister.lowest_price,
          last_price: isPriceFromSale ? todayRegister.last_price : price,
        },
      });
    } else {
      let last_price = price;
      if (isPriceFromSale) {
        const lastRegister = await this.prisma.productPriceHistory.findFirst({
          where: {
            product_id,
          },
          orderBy: { date: 'desc' },
        });

        last_price = lastRegister.last_price;
      }

      await this.prisma.productPriceHistory.create({
        data: {
          product_id,
          was_available: available,
          last_availability: available,
          lowest_price: price,
          last_price,
          date: today.toDate(),
        },
      });
    }
  }

  private async sendProductNotification(
    product_id: string,
    productTitle: string,
    price: number,
  ) {
    const usersProductNotification =
      await this.prisma.userProductNotification.findMany({
        where: { product_id },
      });

    const notificationPromises = usersProductNotification.map(
      async ({ user_id, price: userPrice }) => {
        if (userPrice <= price) return;

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
              title: 'Aviso de preço!',
              body: `Aproveite o desconto em ${productTitle} por apenas ${priceFormatter.format(
                price / 100,
              )}. Compre agora e economize!`,
              data: {
                url: `/produto/${product_id}`,
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

  async create({ category_id, subcategory_id, ...data }: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...data,
        productCategory: category_id ? { create: { category_id } } : undefined,
        productSubcategory: subcategory_id
          ? { create: { subcategory_id } }
          : undefined,
      },
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
      },
    });

    return this.mapWithCategoryAndSubcategory(product);
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
      },
    });

    return products.map((product) =>
      this.mapWithCategoryAndSubcategory(product),
    );
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
      },
    });

    return this.mapWithCategoryAndSubcategory(product);
  }

  async update(
    id: string,
    { category_id, subcategory_id, ...data }: UpdateProductDto,
  ) {
    const { category, subcategory } = await this.findOne(id);

    let productCategory;

    if (category_id === null && category) {
      productCategory = { delete: true };
    } else if (category_id !== undefined) {
      productCategory = category
        ? { update: { category_id } }
        : { create: { category_id } };
    }

    let productSubcategory;

    if (subcategory_id === null && subcategory) {
      productSubcategory = { delete: true };
    } else if (subcategory_id !== undefined) {
      productSubcategory = subcategory
        ? { update: { subcategory_id } }
        : { create: { subcategory_id } };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        productCategory,
        productSubcategory,
      },
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
      },
    });

    return this.mapWithCategoryAndSubcategory(product);
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async assignRetailer(
    product_id: string,
    retailer_id: string,
    assignRetailerDto: AssignRetailerDto,
  ) {
    const product = await this.prisma.productRetailer.create({
      data: { product_id, retailer_id, ...assignRetailerDto },
    });

    await this.updateProductRetailerRelation(product_id, retailer_id, {});

    return product;
  }

  findAllRetailers(product_id: string) {
    return this.prisma.productRetailer.findMany({
      where: { product_id },
      select: {
        price: true,
        available: true,
        html_url: true,
        dummy: true,
        created_at: true,
        updated_at: true,
        retailer: true,
        coupon: true,
        cashback: true,
      },
    });
  }

  async updateProductRetailerRelation(
    product_id: string,
    retailer_id: string,
    { coupon_id, ...data }: UpdateProductRetailerDto,
  ) {
    if (coupon_id) {
      const coupon = await this.prisma.coupon.findUniqueOrThrow({
        where: { id: coupon_id },
      });

      if (coupon.retailer_id !== retailer_id) {
        throw new NotAcceptableException();
      }
    }

    const beforeLowestPriceProduct = await this.findProductWithMinPrice(
      product_id,
    );

    const productRetailer = await this.prisma.productRetailer.update({
      where: {
        product_id_retailer_id: {
          product_id,
          retailer_id,
        },
      },
      data: {
        ...data,
        coupon_id,
      },
      include: {
        product: { select: { title: true } },
      },
    });

    const afterLowestPriceProduct = await this.findProductWithMinPrice(
      product_id,
    );

    // produto está disponível e o preço antes da atualização é diferente do preço depois da atualização
    // ou produto ficou disponivel
    // estou deixando notificar mesmo se o preço depois da atualização é maior
    if (
      (afterLowestPriceProduct.available &&
        beforeLowestPriceProduct.price !== afterLowestPriceProduct) ||
      (!beforeLowestPriceProduct.available && afterLowestPriceProduct.available)
    ) {
      try {
        await this.sendProductNotification(
          product_id,
          afterLowestPriceProduct.title,
          afterLowestPriceProduct.price,
        );
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    }

    // mudar o histórico do dia pegando sempre o produto com o menor preço
    await this.updateProductDailyPrice(
      product_id,
      afterLowestPriceProduct.available,
      beforeLowestPriceProduct.available && !afterLowestPriceProduct.available
        ? beforeLowestPriceProduct.price
        : afterLowestPriceProduct.price,
      false,
    );

    return productRetailer;
  }

  async findProductsWithMinPrice(
    search: string,
    category_id: string,
    subcategory_id: string,
    order: string,
    skip: number,
    take: number,
  ) {
    const where = { product: {}, AND: [] };

    if (search === 'recommended') {
      where.product = {
        ...where.product,
        recommended: true,
      };
    }

    if (search !== 'all' && search !== 'recommended') {
      const words = search.trim().split(/\s+/).filter(Boolean);

      where.AND = words.map((word) => ({
        product: { title: { contains: word, mode: 'insensitive' } },
      }));
    }

    if (category_id !== 'all') {
      where.product = {
        ...where.product,
        productCategory: { category_id },
      };
    }

    if (subcategory_id !== 'all') {
      where.product = {
        ...where.product,
        productSubcategory: { subcategory_id },
      };
    }

    const products = await this.prisma.productRetailer.findMany({
      where,
      distinct: ['product_id'],
      orderBy: [{ available: 'desc' }, { price: 'asc' }],
      select: {
        price: true,
        available: true,
        html_url: true,
        dummy: true,
        created_at: true,
        updated_at: true,
        cashback: true,
        product: {
          include: {
            productCategory: { include: { category: true } },
            productSubcategory: { include: { subcategory: true } },
          },
        },
        retailer: true,
        coupon: true,
      },
      skip,
      take,
    });

    return products.map(({ product: productData, ...sellerData }) =>
      this.mapWithCategoryAndSubcategory({
        ...productData,
        ...sellerData,
      }),
    );
  }

  async findProductWithMinPrice(product_id: string) {
    const { product: productData, ...sellerData } =
      await this.prisma.productRetailer.findFirstOrThrow({
        where: { product: { id: product_id } },
        orderBy: [{ available: 'desc' }, { price: 'asc' }],
        select: {
          price: true,
          available: true,
          html_url: true,
          dummy: true,
          created_at: true,
          updated_at: true,
          cashback: true,
          product: {
            include: {
              productCategory: { include: { category: true } },
              productSubcategory: { include: { subcategory: true } },
            },
          },
          retailer: true,
          coupon: true,
        },
      });

    return this.mapWithCategoryAndSubcategory({
      ...productData,
      ...sellerData,
    });
  }

  findProductPriceHistory(product_id: string) {
    return this.prisma.productPriceHistory.findMany({
      where: { product_id },
      orderBy: { date: 'asc' },
    });
  }

  async updateProductHistoryByDate(
    product_id: string,
    date: string,
    price: number,
  ) {
    const dayRegister = await this.prisma.productPriceHistory.findFirstOrThrow({
      where: {
        product_id,
        date: { equals: dayjs(date).tz().startOf('day').toDate() },
      },
    });

    return this.prisma.productPriceHistory.update({
      where: { id: dayRegister.id },
      data: {
        lowest_price: price,
      },
    });
  }

  async removeProductHistoryByDate(product_id: string, date: string) {
    const dayRegister = await this.prisma.productPriceHistory.findFirstOrThrow({
      where: {
        product_id,
        date: { equals: dayjs(date).tz().startOf('day').toDate() },
      },
    });

    return this.prisma.productPriceHistory.delete({
      where: { id: dayRegister.id },
    });
  }

  removeProductRetailerRelation(product_id: string, retailer_id: string) {
    return this.prisma.productRetailer.delete({
      where: {
        product_id_retailer_id: {
          product_id,
          retailer_id,
        },
      },
    });
  }

  findAllSales(product_id: string) {
    return this.prisma.sale.findMany({
      where: { product_id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        price: true,
        image_url: true,
        html_url: true,
        coupon: true,
        created_at: true,
      },
    });
  }
}

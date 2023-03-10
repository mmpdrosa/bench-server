import { Injectable, NotAcceptableException } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { PrismaService } from 'nestjs-prisma';
import webpush from 'web-push';

import { AssignRetailerDto } from './dto/assign-retailer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductRetailerDto } from './dto/update-product-retailer.dto';
import { UpdateProductDto } from './dto/update-product.dto';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private mapWithCategoryAndSubcategory(product) {
    const { productCategory, productSubcategory, ...data } = product;
    const category = productCategory?.category ?? null;
    const subcategory = productSubcategory?.subcategory ?? null;
    return { ...data, category, subcategory };
  }

  private async updateProductDailyPrice(
    product_id: string,
    available: boolean,
    price: number,
  ) {
    // const today = dayjs().tz('America/Sao_Paulo').startOf('day');
    const today = dayjs().startOf('day');

    const register = await this.prisma.productPriceHistory.findFirst({
      where: {
        product_id,
        date: { gte: today.toDate(), lt: today.add(1, 'day').toDate() },
      },
      orderBy: { date: 'desc' },
    });

    if (register) {
      await this.prisma.productPriceHistory.update({
        where: { id: register.id },
        data: {
          last_availability: available,
          was_available: register.was_available ? true : available,
          lowest_price:
            register.lowest_price > price ? price : register.lowest_price,
          last_price: price,
        },
      });
    } else {
      await this.prisma.productPriceHistory.create({
        data: {
          product_id,
          was_available: available,
          last_availability: available,
          lowest_price: price,
          last_price: price,
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
              title: 'Aviso de pre??o!',
              body: `O produto ${productTitle} agora est?? abaixo do pre??o que voc?? queria!`,
              data: {
                url: 'https://bench-shop.vercel.app/',
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

    await this.updateProductDailyPrice(
      product_id,
      product.available,
      product.price,
    );

    return product;
  }

  findAllRetailers(product_id: string) {
    return this.prisma.productRetailer.findMany({
      where: { product_id },
      select: {
        price: true,
        store: true,
        available: true,
        html_url: true,
        dummy: true,
        created_at: true,
        updated_at: true,
        retailer: true,
        coupon: true,
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

    if ((productRetailer.available && data.price) || data.available) {
      try {
        await this.sendProductNotification(
          product_id,
          productRetailer.product.title,
          productRetailer.price,
        );
      } catch (err) {
        console.error(err);
      }
    }

    await this.updateProductDailyPrice(
      product_id,
      productRetailer.available,
      productRetailer.price,
    );

    return productRetailer;
  }

  async findProductsWithMinPrice(
    search: string,
    category_id: string,
    subcategory_id: string,
  ) {
    const where = { product: {} };

    if (search !== 'all') {
      where.product = {
        ...where.product,
        title: { contains: search, mode: 'insensitive' },
      };
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
      select: {
        price: true,
        store: true,
        available: true,
        html_url: true,
        dummy: true,
        created_at: true,
        updated_at: true,
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

    const res = products.map(
      ({
        product: {
          id,
          title,
          reference_price,
          image_url,
          productCategory,
          productSubcategory,
        },
        ...data
      }) => {
        return {
          id,
          title,
          reference_price,
          image_url,
          ...data,
          category: productCategory ? productCategory.category : null,
          subcategory: productSubcategory
            ? productSubcategory.subcategory
            : null,
        };
      },
    );

    return res.reduce((acc, curr) => {
      const existingProduct = acc.find((product) => product.id === curr.id);
      if (!existingProduct) {
        acc.push(curr);
      } else if (curr.price < existingProduct.price) {
        acc.splice(acc.indexOf(existingProduct), 1, curr);
      }
      return acc;
    }, []);
  }

  async findProductWithMinPrice(product_id: string) {
    const {
      product: {
        id,
        title,
        reference_price,
        image_url,
        specs,
        review_url,
        productCategory,
        productSubcategory,
      },
      ...data
    } = await this.prisma.productRetailer.findFirstOrThrow({
      where: { product: { id: product_id } },
      orderBy: { price: 'asc' },
      select: {
        price: true,
        store: true,
        available: true,
        html_url: true,
        dummy: true,
        created_at: true,
        updated_at: true,
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

    return {
      id,
      title,
      reference_price,
      specs,
      review_url,
      image_url,
      ...data,
      category: productCategory ? productCategory.category : null,
      subcategory: productSubcategory ? productSubcategory.subcategory : null,
    };
  }

  findProductPriceHistory(product_id: string) {
    return this.prisma.productPriceHistory.findMany({ where: { product_id } });
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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create({
    category_id,
    subcategory_id,
    coupon_id,
    ...data
  }: CreateProductDto) {
    console.log();

    return this.prisma.product.create({
      data: {
        ...data,
        productCategory: category_id ? { create: { category_id } } : undefined,
        productSubcategory: subcategory_id
          ? { create: { subcategory_id } }
          : undefined,
        productCoupon: coupon_id ? { create: { coupon_id } } : undefined,
      },
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
        productCoupon: {
          select: { coupon: true },
        },
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
        productCoupon: {
          select: { coupon: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
        productCoupon: {
          select: { coupon: true },
        },
      },
    });
  }

  update(
    id: string,
    { category_id, subcategory_id, coupon_id, ...data }: UpdateProductDto,
  ) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        productCategory:
          category_id === null
            ? { delete: true }
            : category_id
            ? { update: { category_id } }
            : undefined,
        productSubcategory:
          subcategory_id === null
            ? { delete: true }
            : subcategory_id
            ? { update: { subcategory_id } }
            : undefined,
        productCoupon:
          coupon_id === null
            ? { delete: true }
            : coupon_id
            ? { update: { coupon_id } }
            : undefined,
      },
      include: {
        productCategory: {
          select: { category: true },
        },
        productSubcategory: {
          select: { subcategory: true },
        },
        productCoupon: {
          select: { coupon: true },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}

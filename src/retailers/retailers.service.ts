import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateRetailerDto } from './dto/create-retailer.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';

@Injectable()
export class RetailersService {
  constructor(private prisma: PrismaService) {}

  create(createRetailerDto: CreateRetailerDto) {
    return this.prisma.retailer.create({ data: createRetailerDto });
  }

  findAll() {
    return this.prisma.retailer.findMany();
  }

  findOne(id: string) {
    return this.prisma.retailer.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateRetailerDto: UpdateRetailerDto) {
    return this.prisma.retailer.update({
      where: { id },
      data: updateRetailerDto,
    });
  }

  remove(id: string) {
    return this.prisma.retailer.delete({ where: { id } });
  }

  async findAllProducts(retailer_id: string) {
    const products = await this.prisma.productRetailer.findMany({
      where: {
        retailer_id,
      },
      select: {
        price: true,
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
        coupon: true,
      },
    });

    return products.map(
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
  }

  findAllCoupons(retailer_id: string) {
    return this.prisma.coupon.findMany({ where: { retailer_id } });
  }
}

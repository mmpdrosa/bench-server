import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  create(createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({ data: createCouponDto });
  }

  findAll() {
    return this.prisma.coupon.findMany({
      select: {
        id: true,
        available: true,
        code: true,
        discount: true,
        minimum_spend: true,
        comments: true,
        description: true,
        retailer: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.coupon.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        available: true,
        code: true,
        discount: true,
        minimum_spend: true,
        comments: true,
        description: true,
        retailer: true,
      },
    });
  }

  update(id: string, updateCouponDto: UpdateCouponDto) {
    return this.prisma.coupon.update({
      where: { id },
      data: updateCouponDto,
    });
  }

  remove(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}

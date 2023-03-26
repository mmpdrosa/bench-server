import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  create(createSaleDto: CreateSaleDto) {
    return this.prisma.sale.create({ data: createSaleDto });
  }

  findAll() {
    return this.prisma.sale.findMany();
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

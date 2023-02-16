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
}

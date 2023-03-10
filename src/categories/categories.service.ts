import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { subcategories: { select: { id: true, name: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUniqueOrThrow({
      where: { id },
      include: { subcategories: { select: { id: true, name: true } } },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createSubcategoryDto: CreateSubcategoryDto) {
    return this.prisma.subcategory.create({ data: createSubcategoryDto });
  }

  findAll() {
    return this.prisma.subcategory.findMany({
      select: { id: true, name: true, category: true },
    });
  }

  findOne(id: string) {
    return this.prisma.subcategory.findUniqueOrThrow({
      where: { id },
      select: { id: true, name: true, category: true },
    });
  }

  update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.subcategory.delete({ where: { id } });
  }
}

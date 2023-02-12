import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubcategoriesController } from './subcategories.controller';
import { SubcategoriesService } from './subcategories.service';

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService, PrismaService],
})
export class SubcategoriesModule {}

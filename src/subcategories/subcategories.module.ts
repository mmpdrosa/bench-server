import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { SubcategoriesController } from './subcategories.controller';
import { SubcategoriesService } from './subcategories.service';

@Module({
  imports: [PrismaModule],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule {}

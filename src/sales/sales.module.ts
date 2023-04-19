import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { ProductsService } from 'src/products/products.service';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalesController],
  providers: [SalesService, ProductsService],
})
export class SalesModule {}

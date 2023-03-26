import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { RetailersController } from './retailers.controller';
import { RetailersService } from './retailers.service';

@Module({
  imports: [PrismaModule],
  controllers: [RetailersController],
  providers: [RetailersService],
})
export class RetailersModule {}

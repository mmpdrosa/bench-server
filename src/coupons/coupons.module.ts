import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  controllers: [CouponsController],
  providers: [CouponsService, PrismaService],
})
export class CouponsModule {}

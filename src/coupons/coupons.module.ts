import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [PrismaModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}

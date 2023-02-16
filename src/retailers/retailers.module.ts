import { Module } from '@nestjs/common';
import { RetailersService } from './retailers.service';
import { RetailersController } from './retailers.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [RetailersController],
  providers: [RetailersService],
})
export class RetailersModule {}

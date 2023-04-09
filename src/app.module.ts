import {
  HttpStatus,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { AppController } from './app.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { CategoriesModule } from './categories/categories.module';
import { CouponsModule } from './coupons/coupons.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ProductsModule } from './products/products.module';
import { RetailersModule } from './retailers/retailers.module';
import { SalesModule } from './sales/sales.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SubscriptionsModule,
    SubcategoriesModule,
    CouponsModule,
    RetailersModule,
    SalesModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter, {
          P2000: HttpStatus.BAD_REQUEST,
          P2002: HttpStatus.CONFLICT,
          P2003: HttpStatus.NOT_FOUND,
          P2025: HttpStatus.NOT_FOUND,
        });
      },
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'subscriptions', method: RequestMethod.POST },
        { path: 'subscriptions', method: RequestMethod.DELETE },
        'users/notify-product',
        'users/product-notifications',
        'users/unnotify-product',
        'users/toggle-category-notification',
        'users/category-notifications',
        'users/role/admin',
        'users/sales-reactions/for-all',
        'sales/:sale_id/reactions',
      );
  }
}

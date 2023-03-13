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

import { AppController } from './app.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { CategoriesModule } from './categories/categories.module';
import { CouponsModule } from './coupons/coupons.module';
import { ProductsModule } from './products/products.module';
import { RetailersModule } from './retailers/retailers.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';

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
      );
  }
}

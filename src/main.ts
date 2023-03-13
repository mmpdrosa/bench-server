import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import webpush from 'web-push';

import { ApiKeyInterceptor } from './api-key.interceptor';
import { AppModule } from './app.module';

webpush.setVapidDetails(
  'http://localhost:3333',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY,
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalInterceptors(new ApiKeyInterceptor());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Bench')
    .setDescription('The Bench API description')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'api-key', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3333);
}
bootstrap();

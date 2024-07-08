import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormattingInterceptor } from './interceptors/response-formatting.interceptor';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseFormattingInterceptor());

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Hoc Voi Ai API')
    .setDescription('The Hoc Voi Ai API description')
    .setVersion('1.0')
    .addTag('hocvoiai')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Cors
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5002',
      'http://hva-fe-lb-1873420951.ap-southeast-1.elb.amazonaws.com',
      'https://hva-fe-lb-1873420951.ap-southeast-1.elb.amazonaws.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  //Limit body
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  await app.listen(process.env.PORT || 5001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

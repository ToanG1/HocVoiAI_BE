import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormattingInterceptor } from './interceptors/response-formatting.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    origin: ['http://localhost:3000', 'http://localhost:5002'],
  });

  await app.listen(process.env.PORT || 5001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

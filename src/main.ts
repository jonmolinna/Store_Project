import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, //envia cookie
  });

  // cookie
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Exception Global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Documentation Swagger
  const config = new DocumentBuilder()
    .setTitle('My Name Business API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('store')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

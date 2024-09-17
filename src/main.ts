import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  await app.listen(4000);
}
bootstrap();

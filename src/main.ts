import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import csurf from 'csurf';

async function bootstrap() {
  console.log('ENV VARSS');
  console.log(process.env);
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // app.use(csurf());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();

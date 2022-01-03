import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import csurf from 'csurf';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log('ENV VARSS');
  const configService = new ConfigService();

  console.log(process.env.DB_PORT);
  console.log(configService.get('DB_PORT'));
  console.log('ENV VARSS END');

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

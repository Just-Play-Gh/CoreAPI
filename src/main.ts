import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'debug',
      format: winston.format.uncolorize(), //Uncolorize logs as weird character encoding appears when logs are colorized in cloudwatch.
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        // new CloudWatchTransport({
        //   level: 'debug',
        //   name: 'Cloudwatch Logs',
        //   logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        //   logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
        //   awsAccessKeyId: process.env.AWS_ACCESS_KEY,
        //   awsSecretKey: process.env.AWS_KEY_SECRET,
        //   awsRegion: process.env.CLOUDWATCH_AWS_REGION,
        //   messageFormatter: function (item) {
        //     return `${item.level}: ${item.message} ${
        //       item.context === undefined ? '' : JSON.stringify(item.context)
        //     }`;
        //   },
        // }),
      ],
    }),
  });
  app.use(helmet());
  // app.use(csurf());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  });
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('FuelUp API Docs')
      .setDescription('FuelUp API description')
      .setVersion('1.0')
      .addTag('fuel')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(process.env.PORT);
}
bootstrap();

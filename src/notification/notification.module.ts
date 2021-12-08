import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const helpers = (config) => {
  return {
    appName: () => {
      return config.get('APP_NAME');
    },
    webAppUrl: () => {
      return config.get('WEB_APP_URL');
    },
  };
};

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: config.get('MAIL_FROM_ADDRESS'),
        },
        template: {
          dir: join(__dirname, '../emails/templates'),
          adapter: new HandlebarsAdapter(helpers(config)),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

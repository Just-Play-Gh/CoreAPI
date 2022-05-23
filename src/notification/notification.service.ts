import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Otp } from '../otp/entity/otp.entity';
import dayjs from 'dayjs';
import { lastValueFrom, map } from 'rxjs';
import { Expo } from 'expo-server-sdk';
import { NotificationDataType } from 'src/types';
import {
  MobileDevice,
  UserType,
} from 'src/mobile_devices/entities/mobile-device.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    if (process.env.SEND_SMS === 'false') return;
    const url = new URL(process.env.HUBTEL_SMS_CLIENT_URL);
    url.searchParams.append('clientid', process.env.HUBTEL_SMS_CLIENT_ID);
    url.searchParams.append(
      'clientsecret',
      process.env.HUBTEL_SMS_CLIENT_SECRET,
    );
    url.searchParams.append('from', process.env.HUBTEL_SMS_CLIENT_FROM);
    url.searchParams.append('to', phoneNumber);
    url.searchParams.append('content', message);
    const response = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(map((res) => res.data)),
    );
    console.log(response, message);
    if (response && response.status === 0) {
      return true;
    }
    return false;
  }

  async sendForgotPasswordEmail(
    user,
    otp: string,
  ): Promise<{ message: string }> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset Password',
        template: `./forgot-password`,
        context: {
          user: user,
          otp,
        },
      });
    } catch (error) {
      console.log('an error', error);
    }
    return { message: 'Email sent' };
  }

  async sendWelcomeEmail(
    user,
    password: string,
    type = '',
  ): Promise<{ message: string }> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome To FuelUp',
        template: `../emails/templates/welcome-email.hbs`,
        context: {
          user: user,
          type,
          password,
        },
      });
    } catch (error) {
      console.log('an error', error);
    }
    return { message: 'Email sent' };
  }

  async verifyOTP(VerifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { phoneNumber, otp } = VerifyOtpDto;
    const otpRecord = await Otp.findOne(
      { phoneNumber },
      {
        order: {
          id: 'DESC',
        },
      },
    );
    if (!otpRecord)
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    const otpValid = dayjs().diff(dayjs(otpRecord.created), 'seconds');
    const otpVerified = await otpRecord.validateToken(otp);
    if (!otpVerified)
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    if (otpValid > +process.env.OTP_EXPIRES_IN_SECONDS)
      throw new HttpException('OTP has expired', HttpStatus.BAD_REQUEST);
    return true;
  }
  async sendOrderCreatedNotification(
    driverId,
    order,
    type: UserType = UserType.Driver,
  ) {
    const mobileDevice = await MobileDevice.findOne({
      id: driverId,
      user_type: type,
    });
    if (mobileDevice) {
      const notification = [
        {
          title: 'Incoming Order',
          token: mobileDevice.push_notification_token,
          sound: 'default',
          body: 'You have an incoming order',
          data: order,
        },
      ];
      this.sendPushNotification(notification);
    }
  }
  async sendOrderNotAcceptedNotificationToCustomer(customerId, order) {
    const mobileDevice = await MobileDevice.findOne({
      id: customerId,
      user_type: UserType.Customer,
    });
    if (mobileDevice) {
      const notification = [
        {
          title: 'All drivers are busy',
          token: mobileDevice.push_notification_token,
          sound: 'default',
          body: 'All our drivers are busy, please try again later',
          data: order,
        },
      ];
      this.sendPushNotification(notification);
    }
  }
  async sendPushNotification(notificationData: NotificationDataType[]) {
    const expo = new Expo();
    const messages = [];
    for (const notification of notificationData) {
      const { token, sound, body, data } = notification;
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: token,
        sound: sound,
        body,
        data: { withSome: 'data' },
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    (async () => {
      for (const chunk of chunks) {
        try {
          console.log(chunk);
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('error', error);
        }
      }
    })();

    const receiptIds = [];
    for (const ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (const chunk of receiptIdChunks) {
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts);

          for (const receiptId in receipts) {
            const { status, details } = receipts[receiptId];

            if (status === 'ok') {
              continue;
            } else if (status === 'error') {
              console.error(`There was an error sending a notification`);
              if (details && (details as { error: string }).error) {
                console.error(
                  `The error code is ${(details as { error: string }).error}`,
                );
              }
            }
          }
        } catch (error) {
          console.error('err', error);
        }
      }
    })();
  }
}

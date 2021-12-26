import { HttpService } from '@nestjs/axios';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
export declare class NotificationService {
    private readonly mailerService;
    private readonly httpService;
    constructor(mailerService: MailerService, httpService: HttpService);
    sendSMS(phoneNumber: string, message: string): Promise<boolean>;
    sendOTP(phoneNumber: string, otp: string): Promise<{
        otp: string;
    }>;
    sendForgotPasswordEmail(user: any, otp: string): Promise<string>;
    verifyOTP(VerifyOtpDto: VerifyOtpDto): Promise<boolean>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mailer_1 = require("@nestjs-modules/mailer");
const otp_entity_1 = require("../otp/entity/otp.entity");
const dayjs_1 = __importDefault(require("dayjs"));
const rxjs_1 = require("rxjs");
let NotificationService = class NotificationService {
    constructor(mailerService, httpService) {
        this.mailerService = mailerService;
        this.httpService = httpService;
    }
    async sendSMS(phoneNumber, message) {
        const url = new URL(process.env.HUBTEL_SMS_CLIENT_URL);
        url.searchParams.append('clientid', process.env.HUBTEL_SMS_CLIENT_ID);
        url.searchParams.append('clientsecret', process.env.HUBTEL_SMS_CLIENT_SECRET);
        url.searchParams.append('from', process.env.HUBTEL_SMS_CLIENT_FROM);
        url.searchParams.append('to', phoneNumber);
        url.searchParams.append('content', message);
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url.toString()).pipe((0, rxjs_1.map)((res) => res.data)));
        console.log(response);
        if (response && response.status === 0) {
            return true;
        }
        return false;
    }
    async sendOTP(phoneNumber, otp) {
        console.log(otp, phoneNumber);
        return { otp };
    }
    async sendForgotPasswordEmail(user, otp) {
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
        }
        catch (error) {
            console.log('an error', error);
        }
        return '1';
    }
    async verifyOTP(VerifyOtpDto) {
        const { phoneNumber, otp } = VerifyOtpDto;
        const otpRecord = await otp_entity_1.Otp.findOne({ phoneNumber }, {
            order: {
                id: 'DESC',
            },
        });
        if (!otpRecord)
            throw new common_1.HttpException('Invalid OTP', common_1.HttpStatus.BAD_REQUEST);
        const otpValid = (0, dayjs_1.default)().diff((0, dayjs_1.default)(otpRecord.created), 'seconds');
        const otpVerified = await otpRecord.validateToken(otp);
        if (!otpVerified)
            throw new common_1.HttpException('Invalid OTP', common_1.HttpStatus.BAD_REQUEST);
        if (otpValid > +process.env.OTP_EXPIRES_IN_SECONDS)
            throw new common_1.HttpException('OTP has expired', common_1.HttpStatus.BAD_REQUEST);
        return true;
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        axios_1.HttpService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map
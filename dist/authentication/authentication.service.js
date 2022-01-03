"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const libphonenumber_js_1 = require("libphonenumber-js");
const generator_1 = require("../helpers/generator");
const validator_1 = require("../helpers/validator");
const send_otp_dto_1 = require("../notification/dto/send-otp.dto");
const verify_otp_dto_1 = require("../notification/dto/verify-otp.dto");
const notification_service_1 = require("../notification/notification.service");
const types_1 = require("../types");
const change_password_dto_1 = require("./dto/change-password.dto");
const login_dto_1 = require("./dto/login.dto");
const register_customer_dto_1 = require("./dto/register-customer.dto");
const register_driver_dto_1 = require("./dto/register-driver.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const randomToken = __importStar(require("rand-token"));
const dayjs_1 = __importDefault(require("dayjs"));
const access_token_entity_1 = require("./entity/access-token.entity");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
const role_service_1 = require("../role/role.service");
const otp_entity_1 = require("../otp/entity/otp.entity");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
let AuthenticationService = class AuthenticationService {
    constructor(jwtService, notificationService, roleService) {
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.roleService = roleService;
    }
    async login(body, queries, res) {
        try {
            const { contain } = queries;
            const { phoneNumber, country, userType, password } = body;
            const validDto = await (0, validator_1.validateDto)(new login_dto_1.LoginDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const parsePhone = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, country).number.substring(1);
            const user = await types_1.userEntities[userType].findOne({
                phoneNumber: String(parsePhone),
                status: types_1.StatusType.Active,
            }, { relations: contain === null || contain === void 0 ? void 0 : contain.split(',') });
            if (!user || !(await (user === null || user === void 0 ? void 0 : user.validatePassword(password))))
                throw new common_1.UnauthorizedException();
            user['role'] = userType;
            return this.generateToken(user, res);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async oauthLogin(body, queries, res) {
        const audienceIdType = {
            web: process.env.GOOGLE_CLIENT_ID,
            ios: process.env.GOOGLE_IOS_CLIENT_ID,
            android: process.env.GOOGLE_ANDROID_CLIENT_ID,
        };
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            await client.verifyIdToken({
                idToken: body.idToken,
                audience: audienceIdType[queries.platform],
            });
            const oauthUser = jsonwebtoken_1.default.decode(body.idToken);
            body.email = oauthUser.email;
            const validDto = await (0, validator_1.validateDto)(new login_dto_1.oauthLoginDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { userType, email } = body;
            const user = await types_1.userEntities[userType].findOne({
                email,
                status: types_1.StatusType.Active,
            });
            if (!user) {
                body.firstName = oauthUser.given_name;
                body.lastName = oauthUser.family_name;
                body.provider = queries.platform !== 'web' ? queries.provider : null;
                return await this.registerOauthUser(body, res);
            }
            return this.generateToken(user, res);
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException();
        }
    }
    async registerDriver(body, res) {
        try {
            const validDto = await (0, validator_1.validateDto)(new register_driver_dto_1.RegisterDriverDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            return this.register(body, res);
        }
        catch (error) {
            throw error;
        }
    }
    async registerCustomerSendOtp(body) {
        try {
            const validDto = await (0, validator_1.validateDto)(new send_otp_dto_1.SendOtpDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { phoneNumber, country, userType } = body;
            const parsePhone = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, (country !== null && country !== void 0 ? country : 'GH')).number.substring(1);
            console.log('I haveebn passed', parsePhone);
            const otp = (0, generator_1.generateOtp)(4);
            await this.saveOtp(parsePhone, otp, userType);
            await this.notificationService.sendOTP(parsePhone, otp);
            return { message: 'OTP successful sent' };
        }
        catch (error) {
            throw error;
        }
    }
    async verifyOtp(body) {
        try {
            const validDto = await (0, validator_1.validateDto)(new verify_otp_dto_1.VerifyOtpDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { phoneNumber, country, otp } = body;
            const parsePhone = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, (country !== null && country !== void 0 ? country : 'GH')).number.substring(1);
            await this.notificationService.verifyOTP({
                phoneNumber: parsePhone,
                otp,
            });
            if (body.deleteOtp) {
                await otp_entity_1.Otp.delete({ phoneNumber: parsePhone });
            }
            return { message: 'OTP successful verified' };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async registerCustomer(body, res) {
        try {
            const validDto = await (0, validator_1.validateDto)(new register_customer_dto_1.RegisterCustomerDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            return this.register(body, res);
        }
        catch (error) {
            throw error;
        }
    }
    async register(body, res) {
        const { userType, email, phoneNumber, country = 'GH', password } = body;
        const parsePhone = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, country).number.substring(1);
        const user = types_1.userEntities[userType].create();
        const userExists = await this.findUser(userType, parsePhone, email);
        if (userExists) {
            throw new common_1.ConflictException(`${userType.charAt(0).toUpperCase() + userType.slice(1)} already exists`);
        }
        for (const key in body) {
            if (key in types_1.userEntities[userType].getRepository().metadata.propertiesMap) {
                user[key] = body[key];
            }
        }
        user.password = password !== null && password !== void 0 ? password : (0, generator_1.generatePassword)(6);
        user.country = country;
        user.phoneNumber = parsePhone;
        user.status = types_1.StatusType.Active;
        await types_1.userEntities[userType].save(user);
        return this.generateToken(user, res);
    }
    async registerOauthUser(body, res) {
        const { userType, email } = body;
        const user = types_1.userEntities[userType].create();
        const userExists = await this.findUser(userType, email);
        if (userExists) {
            throw new common_1.ConflictException(`${userType.charAt(0).toUpperCase() + userType.slice(1)} already exists`);
        }
        for (const key in body) {
            if (key in types_1.userEntities[userType].getRepository().metadata.propertiesMap) {
                user[key] = body[key];
            }
        }
        user.emailVerifiedAt = new Date();
        user.status = types_1.StatusType.Active;
        await types_1.userEntities[userType].save(user);
        return this.generateToken(user, res);
    }
    async sendForgotPasswordOtp(body) {
        try {
            const validDto = await (0, validator_1.validateDto)(new forgot_password_dto_1.ForgotPasswordWithOtp(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { userType, phoneNumber, country } = body;
            const parsePhone = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, (country !== null && country !== void 0 ? country : 'GH')).number.substring(1);
            const userExists = await this.findUser(userType, parsePhone);
            if (!userExists)
                throw new common_1.NotFoundException('User account not found');
            const otp = (0, generator_1.generateOtp)(4);
            await this.saveOtp(parsePhone, otp, userType);
            await this.notificationService.sendOTP(parsePhone, otp);
            return { message: 'OTP successfully sent' };
        }
        catch (error) {
            throw error;
        }
    }
    async sendForgotPasswordEmail(body) {
        try {
            const validDto = await (0, validator_1.validateDto)(new forgot_password_dto_1.ForgotPasswordWithEmail(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { userType, email } = body;
            const user = await this.findUser(userType, null, email);
            if (!user)
                throw new common_1.NotFoundException('User account not found');
            const otp = (0, generator_1.generateOtp)(9);
            await this.saveOtp(user.phoneNumber, otp, userType);
            await this.notificationService.sendForgotPasswordEmail(user, otp);
            return { message: 'Email successfully sent' };
        }
        catch (error) {
            throw error;
        }
    }
    async resetPasswordWithOtp(body) {
        try {
            const validDto = await (0, validator_1.validateDto)(new reset_password_dto_1.ResetPasswordOtpDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { userType, phoneNumber, country, otp, password } = body;
            const parsePhone = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, (country !== null && country !== void 0 ? country : 'GH')).number.substring(1);
            await this.notificationService.verifyOTP({
                phoneNumber: parsePhone,
                otp,
            });
            const user = await this.findUser(userType, parsePhone);
            if (!user)
                throw new common_1.NotFoundException('User account not found');
            user.password = password;
            await user.save();
            await otp_entity_1.Otp.delete({ phoneNumber: parsePhone });
            return { message: 'Password reset successful' };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async resetPasswordWithEmail(body) {
        try {
            const validDto = await (0, validator_1.validateDto)(new reset_password_dto_1.ResetPasswordEmailDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { userType, email, otp, password } = body;
            const user = await this.findUser(userType, null, email);
            if (!user)
                throw new common_1.NotFoundException('User account not found');
            await this.notificationService.verifyOTP({
                phoneNumber: user.phoneNumber,
                otp,
            });
            user.password = password;
            await user.save();
            await otp_entity_1.Otp.delete({ phoneNumber: user.phoneNumber });
            return { message: 'Password reset successful' };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async changePassword(body, userContext) {
        try {
            const validDto = await (0, validator_1.validateDto)(new change_password_dto_1.ChangePasswordDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            const { userType, currentPassword, newPassword } = body;
            const user = await types_1.userEntities[userType].findOne({ id: userContext.id });
            if (!user || !user.validatePassword(currentPassword))
                throw new common_1.HttpException('Invalid Password', common_1.HttpStatus.BAD_REQUEST);
            user.password = newPassword;
            await types_1.userEntities[userType].save(user);
            return { message: 'Password changed successful' };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async refreshToken(userContext, req, res) {
        var _a;
        const token = this.jwtService.sign(userContext);
        const refreshToken = (_a = req === null || req === void 0 ? void 0 : req.cookies['auth-cookie']) === null || _a === void 0 ? void 0 : _a.refreshToken;
        const secretData = {
            token: token,
            refreshToken: refreshToken !== null && refreshToken !== void 0 ? refreshToken : (await this.getRefreshToken()),
        };
        res.cookie('auth-cookie', secretData, { httpOnly: true });
        return { message: 'Refresh successful' };
    }
    async saveOtp(phoneNumber, otp, userType) {
        const findOtp = await otp_entity_1.Otp.getRepository()
            .createQueryBuilder()
            .where({ phoneNumber })
            .getOne();
        if (findOtp) {
            otp_entity_1.Otp.delete({ phoneNumber });
        }
        const passwordReset = otp_entity_1.Otp.create();
        passwordReset['phoneNumber'] = phoneNumber;
        passwordReset['token'] = otp;
        passwordReset['userType'] = userType;
        console.log(passwordReset);
        await otp_entity_1.Otp.save(passwordReset);
    }
    async findUser(userType, phoneNumber = null, email = null) {
        return await types_1.userEntities[userType]
            .getRepository()
            .createQueryBuilder()
            .where({ phoneNumber })
            .orWhere({ email })
            .getOne();
    }
    async generateToken(user, res) {
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };
        user['accessToken'] = this.jwtService.sign(payload);
        const secretData = {
            token: user.accessToken,
            refreshToken: await this.getRefreshToken(),
        };
        res.cookie('auth-cookie', secretData, { httpOnly: true });
        user['refreshToken'] = secretData.refreshToken.token;
        delete user.password;
        await this.saveAccessToken(user);
        await this.saveRefreshToken(user);
        return user;
    }
    async saveAccessToken(user) {
        let userToken = await access_token_entity_1.AccessToken.findOne({ userId: user.id });
        if (userToken) {
            userToken.token = user.accessToken;
        }
        else {
            userToken = access_token_entity_1.AccessToken.create();
            userToken.userId = user.id;
            userToken.token = user.accessToken;
        }
        userToken.save();
    }
    async saveRefreshToken(user) {
        let refreshToken = await refresh_token_entity_1.RefreshToken.findOne({ userId: user.id });
        if (refreshToken) {
            refreshToken.token = user.refreshToken;
        }
        else {
            refreshToken = refresh_token_entity_1.RefreshToken.create();
            refreshToken.userId = user.id;
            refreshToken.token = user.refreshToken;
        }
        refreshToken.save();
    }
    async getRefreshToken() {
        const refresh = {
            token: randomToken.generate(32),
            expiry: (0, dayjs_1.default)().add(2, 'day').format('YYYY/MM/DD'),
        };
        return refresh;
    }
};
AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        notification_service_1.NotificationService,
        role_service_1.RoleService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map
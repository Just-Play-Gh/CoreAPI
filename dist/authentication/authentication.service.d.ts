import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';
import { Request, Response } from 'express';
import { RoleService } from '../role/role.service';
export declare class AuthenticationService {
    private jwtService;
    private readonly notificationService;
    private readonly roleService;
    constructor(jwtService: JwtService, notificationService: NotificationService, roleService: RoleService);
    login(body: any, queries: any, res: Response): Promise<any>;
    oauthLogin(body: any, queries: any, res: Response): Promise<any>;
    registerDriver(body: any, res: any): Promise<any>;
    registerCustomerSendOtp(body: any): Promise<{
        message: string;
    }>;
    verifyOtp(body: any): Promise<{
        message: string;
    }>;
    registerCustomer(body: any, res: Response): Promise<any>;
    register(body: any, res: Response): Promise<any>;
    registerOauthUser(body: any, res: Response): Promise<any>;
    sendForgotPasswordOtp(body: any): Promise<{
        message: string;
    }>;
    sendForgotPasswordEmail(body: any): Promise<{
        message: string;
    }>;
    resetPasswordWithOtp(body: any): Promise<{
        message: string;
    }>;
    resetPasswordWithEmail(body: any): Promise<{
        message: string;
    }>;
    changePassword(body: any, userContext: any): Promise<{
        message: string;
    }>;
    refreshToken(userContext: any, req: Request, res: Response): Promise<{
        message: string;
    }>;
    saveOtp(phoneNumber: any, otp: any, userType: any): Promise<void>;
    findUser(userType: string, phoneNumber?: string | null, email?: string | null): Promise<any>;
    generateToken(user: any, res: Response): Promise<any>;
    saveAccessToken(user: any): Promise<void>;
    saveRefreshToken(user: any): Promise<void>;
    protected getRefreshToken(): Promise<{
        token: string;
        expiry: string;
    }>;
}

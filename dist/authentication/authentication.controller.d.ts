import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
export declare class AuthenticationController {
    private authService;
    constructor(authService: AuthenticationService);
    login(res: Response, loginDto: any, queries: any): Promise<any>;
    registerDriver(registerDto: any, res: any): Promise<any>;
    registerCustomerSendOtp(registerSendOtpDto: any): Promise<{
        message: string;
    }>;
    registerCustomerVerifyOtp(registerVerifyOtpDto: any): Promise<{
        message: string;
    }>;
    registerCustomer(registerDto: any, res: any): Promise<any>;
    sendForgotPasswordEmal(registerDto: any): Promise<{
        message: string;
    }>;
    sendForgotPasswordEmail(registerDto: any): Promise<{
        message: string;
    }>;
    resetOtpPassword(registerDto: any): Promise<{
        message: string;
    }>;
    resetEmailPassword(registerDto: any): Promise<{
        message: string;
    }>;
    changePassword(registerDto: any, userContext: any): Promise<{
        message: string;
    }>;
    refreshToken(userContext: any, res: any, req: any): Promise<{
        message: string;
    }>;
}

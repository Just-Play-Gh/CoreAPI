import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { ForgotPasswordWithEmail, ForgotPasswordWithOtp } from './dto/forgot-password.dto';
import { ResetPasswordEmailDto, ResetPasswordOtpDto } from './dto/reset-password.dto';
export declare class AuthenticationController {
    private authService;
    constructor(authService: AuthenticationService);
    login(res: Response, loginDto: any, queries: any): Promise<any>;
    oauthLogin(res: Response, loginDto: any, queries: any): Promise<any>;
    registerDriver(registerDto: any, res: any): Promise<any>;
    registerCustomerSendOtp(registerSendOtpDto: any): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: any): Promise<{
        message: string;
    }>;
    registerCustomer(registerDto: any, res: any): Promise<any>;
    sendForgotPasswordEmal(forgotPasswordDto: ForgotPasswordWithOtp): Promise<{
        message: string;
    }>;
    sendForgotPasswordEmail(forgotPassword: ForgotPasswordWithEmail): Promise<{
        message: string;
    }>;
    resetPasswordWithOtp(resetPassword: ResetPasswordOtpDto): Promise<{
        message: string;
    }>;
    resetPasswordWithEmail(resetPassword: ResetPasswordEmailDto): Promise<{
        message: string;
    }>;
    changePassword(registerDto: any, userContext: any): Promise<{
        message: string;
    }>;
    refreshToken(userContext: any, res: any, req: any): Promise<{
        message: string;
    }>;
}

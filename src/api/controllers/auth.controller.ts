import { AuthData } from "../../domain/entities/auth_data";
import { AuthService } from "../../domain/services/auth.service";

export class AuthController {
    static async refreshToken(refreshToken: string): Promise<{ authData: AuthData; refreshToken: string; accessToken: string }> {
        return await AuthService.refreshToken(refreshToken);
    }

    static async phoneSignInClient(phoneNumber: string): Promise<string> {
        return await AuthService.phoneSignInClient(phoneNumber);
    }

    static async googleSignInClient(code: string){
        return await AuthService.googleSignInClient(code);
    }

    static async verifyPhoneCodeClient(
        token: string,
        code: string
    ): Promise<{ authData: AuthData; refreshToken: string; accessToken: string } | { registrationToken: string }> {
        return await AuthService.verifyPhoneCodeClient(token, code);
    }

    static async registerClient(
        registrationToken: string,
        phone: string,
        firstName: string,
        lastName: string,
        email: string
    ): Promise<{ authData: AuthData; refreshToken: string; accessToken: string }> {
        return await AuthService.registerClient(registrationToken, phone, firstName, lastName, email);
    }
}

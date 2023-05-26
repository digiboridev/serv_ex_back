import { JwtPayload, sign, verify } from "jsonwebtoken";
import { UserService } from "../services/user.service";
import { UserCredentials } from "../models/user";
import { SessionService } from "../services/session.service";
import { VerificationService } from "../services/verification.service";
import { ApiError, errorMessage } from "../utils/errors";

export class AuthController {
    static signAccessToken(userId: string): string {
        return sign({ userId: userId }, "access_token_secret", { expiresIn: "15m" });
    }

    static signRefreshToken(sessionId: string): string {
        return sign({ sessionId: sessionId }, "refresh_token_secret", { expiresIn: "1y" });
    }

    static signRegistrationToken(credential: string, credentialType: "phone" | "email"): string {
        return sign({ credential, credentialType }, "registration_token_secret", { expiresIn: "15m" });
    }

    static verifyAccessToken(token: string): string {
        const payload = verify(token, "access_token_secret");
        if (typeof payload !== "object" || !("userId" in payload)) throw new Error("Invalid payload");
        return payload.userId;
    }

    static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        let sessionId: string;
        
        try {
            const payload = verify(refreshToken, "refresh_token_secret");
            sessionId = (payload as JwtPayload).sessionId;
        } catch (error) {
            throw new ApiError(errorMessage(error), 400);
        }

        if (!sessionId) throw new ApiError("Invalid refresh token", 400);

        const session = await SessionService.getSessionById(sessionId);
        if (!session) throw new ApiError("Session expired", 403);

        const user = await UserService.getUserDataById(session.user);
        if (!user) throw new ApiError("Invalid user", 404);

        const accessToken = this.signAccessToken(user.id);
        return { accessToken };
    }

    static async phoneSignIn(phoneNumber: string): Promise<string> {
        const { code, token } = await VerificationService.createPhoneVerification(phoneNumber);
        // send sms code
        return token;
    }

    static async verifyCode(token: string, code: string): Promise<{ refreshToken: string; accessToken: string } | { registrationToken: string }> {
        const result = await VerificationService.verifyCode(token, code);
        if (!result) throw new ApiError("Invalid code", 400);

        let user: UserCredentials | null = null;

        if (result.credentialType === "phone") {
            user = await UserService.getUserCredentialsByPhone(result.credential);
        }

        if (result.credentialType === "email") {
            user = await UserService.getUserCredentialsByEmail(result.credential);
        }

        if (!user) {
            const registrationToken = this.signRegistrationToken(result.credential, result.credentialType);
            return { registrationToken };
        } else {
            const session = await SessionService.createSession(user.id);
            const refreshToken = this.signRefreshToken(session.id);
            const accessToken = this.signAccessToken(user.id);

            return { refreshToken, accessToken };
        }
    }
}

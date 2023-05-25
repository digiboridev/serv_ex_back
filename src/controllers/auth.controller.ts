import { sign, verify } from "jsonwebtoken";
import { UserService } from "../services/user.service";
import { UserCredentials } from "../models/user";
import { SessionService } from "../services/session.service";
import { Credentials } from "../dto/credentials";

export class AuthController {
    static async passwordLogin(credentials: Credentials): Promise<{ refreshToken: string; accessToken: string }> {
        const { email, phone, password } = credentials;

        let user: UserCredentials | null = null;

        if (email) user = await UserService.getUserCredentialsByEmail(email);
        if (phone) user = await UserService.getUserCredentialsByPhone(phone);

        if (!user) throw new Error("No user found");
        if (user.password !== password) throw new Error("Wrong password");

        const session = await SessionService.createSession(user.id);
        const refreshToken = this.signRefreshToken(session.id);
        const accessToken = this.signAccessToken(user.id);

        return { refreshToken, accessToken };
    }

    static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = verify(refreshToken, "refresh_token_secret");
        if (typeof payload !== "object" || !("sessionId" in payload)) throw new Error("Invalid payload");

        const session = await SessionService.getSessionById(payload.sessionId);
        if (!session) throw new Error("Session expired");

        const user = await UserService.getUserDataById(session.user);
        if (!user) throw new Error("Invalid user");

        const accessToken = this.signAccessToken(user.id);
        return { accessToken };
    }

    static signAccessToken(userId: string): string {
        return sign({ userId: userId }, "access_token_secret", { expiresIn: "15m" });
    }

    static signRefreshToken(sessionId: string): string {
        return sign({ sessionId: sessionId }, "refresh_token_secret", { expiresIn: "1y" });
    }

    static verifyAccessToken(token: string): string {
        const payload = verify(token, "access_token_secret");
        if (typeof payload !== "object" || !("userId" in payload)) throw new Error("Invalid payload");
        return payload.userId;
    }
}

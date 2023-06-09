import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ApiError, errorMessage } from "../utils/errors";
import { UserService } from "./user.service";
import { AuthData, Entity } from "../models/auth_data";
import { Session, SessionModel } from "../models/session";
import { User } from "../models/user";
import { CompanyService } from "./company.service";
import { VerificationService } from "./verification.service";

export class AuthService {
    static signAccessToken(authdata: AuthData): string {
        return sign(authdata, "access_token_secret", { expiresIn: "15m" });
    }
    static signRefreshToken(sessionId: string): string {
        return sign({ sessionId: sessionId }, "refresh_token_secret", { expiresIn: "1y" });
    }

    static signRegistrationToken(credential: string, credentialType: "phone" | "email"): string {
        return sign({ credential, credentialType }, "registration_token_secret", { expiresIn: "15m" });
    }

    static verifyAccessToken(token: string): AuthData {
        const payload = verify(token, "access_token_secret");
        if (payload instanceof Object && "scope" in payload) {
            return payload as AuthData;
        } else {
            throw new Error("Invalid access token");
        }
    }

    static async createSession(entity: Entity): Promise<Session> {
        return await SessionModel.create({ entityId: entity.id, scope: entity.scope });
    }

    static async getSessionById(id: string): Promise<Session | null> {
        return await SessionModel.findById(id);
    }

    static async deleteSessionById(id: string) {
        await SessionModel.findByIdAndDelete(id);
    }

    static async createAuthData(entity: Entity): Promise<AuthData> {
        if (entity.scope === "client") {
            const user = await UserService.getUserById(entity.id);
            if (!user) throw new ApiError("User not found", 404);
            const companies = await CompanyService.getCompaniesByMemberId(user.id);
            const companiesIds = companies.map((company) => company.id);
            return { scope: "client", entityId: user.id, companiesIds };
        }

        if (entity.scope === "vendor") {
            throw new ApiError("not implemented", 501);
        }

        throw new ApiError("Invalid scope", 400);
    }

    static async refreshToken(refreshToken: string): Promise<{ authData: AuthData; refreshToken: string; accessToken: string }> {
        let sessionId: string;

        try {
            const payload = verify(refreshToken, "refresh_token_secret");
            sessionId = (payload as JwtPayload).sessionId;
        } catch (error) {
            throw new ApiError(errorMessage(error), 400);
        }

        if (!sessionId) throw new ApiError("Invalid refresh token", 400);

        const session = await AuthService.getSessionById(sessionId);
        if (!session) throw new ApiError("Session expired", 403);

        const authData = await this.createAuthData({ id: session.entityId, scope: session.scope });
        const newRefreshToken = AuthService.signRefreshToken(session.id);
        const newAccessToken = AuthService.signAccessToken(authData);
        return { authData: authData, refreshToken: newRefreshToken, accessToken: newAccessToken };
    }

    static async phoneSignInClient(phoneNumber: string): Promise<string> {
        const { code, token } = await VerificationService.createPhoneVerification(phoneNumber);
        // send sms code
        return token;
    }

    static async verifyPhoneCodeClient(
        token: string,
        code: string
    ): Promise<{ authData: AuthData; refreshToken: string; accessToken: string } | { registrationToken: string }> {
        const result = await VerificationService.verifyCode(token, code);
        if (!result) throw new ApiError("Invalid code", 400);

        let user: User | null = null;

        if (result.credentialType === "phone") {
            user = await UserService.getUserByPhone(result.credential);
        }

        if (result.credentialType === "email") {
            user = await UserService.getUserByEmail(result.credential);
        }

        if (!user) {
            const registrationToken = this.signRegistrationToken(result.credential, result.credentialType);
            return { registrationToken };
        } else {
            const authData = await this.createAuthData({ id: user.id, scope: "client" });
            const session = await AuthService.createSession({ id: user.id, scope: "client" });
            const refreshToken = AuthService.signRefreshToken(session.id);
            const accessToken = AuthService.signAccessToken(authData);
            return { authData: authData, refreshToken: refreshToken, accessToken: accessToken };
        }
    }

    static async registerClient(
        registrationToken: string,
        phone: string,
        firstName: string,
        lastName: string,
        email: string
    ): Promise<{ authData: AuthData; refreshToken: string; accessToken: string }> {
        let credential: string;
        let credentialType: "phone" | "email";

        try {
            const payload = verify(registrationToken, "registration_token_secret");
            if (typeof payload !== "object" || !("credential" in payload) || !("credentialType" in payload)) throw new Error("Invalid payload");
            credential = payload.credential;
            credentialType = payload.credentialType;
        } catch (error) {
            throw new ApiError(errorMessage(error), 400);
        }

        if (!credential || !credentialType) throw new ApiError("Invalid registration token", 400);

        if (credentialType === "phone") {
            if (phone !== credential) throw new ApiError("Invalid phone", 400);
        }
        if (credentialType === "email") {
            if (email !== credential) throw new ApiError("Invalid email", 400);
        }

        const user = await UserService.createUser(firstName, lastName, phone, email, credentialType === "phone", credentialType === "email");

        const authData = await this.createAuthData({ id: user.id, scope: "client" });
        const session = await AuthService.createSession({ id: user.id, scope: "client" });
        const refreshToken = AuthService.signRefreshToken(session.id);
        const accessToken = AuthService.signAccessToken(authData);
        return { authData: authData, refreshToken: refreshToken, accessToken: accessToken };
    }
}

import { VerificationCodeModel } from "../models/verification_code";

export class VerificationService {
    static async createPhoneVerification(phoneNumber: string): Promise<{ code: string; token: string }> {
        // const fourDigitCode = Math.floor(1000 + Math.random() * 9000).toString();
        // TODO send real code
        const fourDigitCode = "1234";
        const code = await VerificationCodeModel.create({ credential: phoneNumber, credentialType: "phone", code: fourDigitCode });
        return { code: fourDigitCode, token: code.id };
    }

    static async createEmailVerification(email: string): Promise<{ code: string; token: string }> {
        // const fourDigitCode = Math.floor(1000 + Math.random() * 9000).toString();
        // TODO send real code
        const fourDigitCode = "1234";
        const code = await VerificationCodeModel.create({ credential: email, credentialType: "email", code: fourDigitCode });
        return { code: fourDigitCode, token: code.id };
    }

    static async verifyCode(token: string, code: string): Promise<false | { credential: string; credentialType: "phone" | "email" }> {
        const verificationCode = await VerificationCodeModel.findById(token);
        if (!verificationCode) return false;
        if (verificationCode.code !== code) return false;
        return { credential: verificationCode.credential, credentialType: verificationCode.credentialType };
    }
}

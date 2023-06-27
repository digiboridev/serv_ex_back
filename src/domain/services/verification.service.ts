import { SL } from "../../core/service_locator";

export class VerificationService {
    static async createPhoneVerification(phoneNumber: string): Promise<{ code: string; token: string }> {
        // const fourDigitCode = Math.floor(1000 + Math.random() * 9000).toString();
        // TODO send real code
        const fourDigitCode = "1234";
        const token = await SL.verificationCodeRepo.createVerificationCode(phoneNumber, "phone", fourDigitCode);
        return { code: fourDigitCode, token: token };
    }

    static async createEmailVerification(email: string): Promise<{ code: string; token: string }> {
        // const fourDigitCode = Math.floor(1000 + Math.random() * 9000).toString();
        // TODO send real code
        const fourDigitCode = "1234";
        const token = await SL.verificationCodeRepo.createVerificationCode(email, "email", fourDigitCode);
        return { code: fourDigitCode, token: token };
    }

    static async verifyCode(token: string, code: string): Promise<false | { credential: string; credentialType: "phone" | "email" }> {
        const verificationCode = await SL.verificationCodeRepo.findCode(token);
        if (!verificationCode) return false;
        if (verificationCode.code !== code) return false;
        return { credential: verificationCode.credential, credentialType: verificationCode.credentialType };
    }
}

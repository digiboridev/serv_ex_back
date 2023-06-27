import { VerificationCodeModel } from "../../data/mongo/models/verification_code";
import { VerificationCode } from "../entities/verification_code";

export interface VerificationCodeRepository {
    /** Create a new verification code */
    createVerificationCode(credential: string, credentialType: "phone" | "email", code: string): Promise<string>;
    /** Find a verification code */
    findCode(token: string): Promise<VerificationCode | null>;
}

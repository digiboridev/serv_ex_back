import { VerificationCode } from "../../../domain/entities/verification_code";
import { VerificationCodeRepository } from "../../../domain/repositories/verification_code.repository";
import { VerificationCodeModel } from "../models/verification_code";

export class VerificationCodeRepositoryMongoImpl implements VerificationCodeRepository {
    async createVerificationCode(credential: string, credentialType: "phone" | "email", code: string): Promise<string> {
        const verificationCode = await VerificationCodeModel.create({ credential: credential, credentialType: credentialType, code: code });
        return verificationCode.id;
    }

    async findCode(token: string): Promise<VerificationCode | null> {
        const verificationCode = await VerificationCodeModel.findById(token);
        return verificationCode?.toObject() ?? null;
    }
}

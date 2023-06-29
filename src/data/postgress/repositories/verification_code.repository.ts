import { VerificationCode } from "../../../domain/entities/verification_code";
import { VerificationCodeRepository } from "../../../domain/repositories/verification_code.repository";
import { prisma } from "../client";

export class VerificationCodeRepositoryPostgressImpl implements VerificationCodeRepository {
    async createVerificationCode(credential: string, credentialType: "phone" | "email", code: string): Promise<string> {
        const verificationCode = await prisma.verificationCode.create({
            data: {
                credential: credential,
                credentialType: credentialType,
                code: code,
            },
        });

        return verificationCode.id;

    }

    async findCode(token: string): Promise<VerificationCode | null> {
        const verificationCode = await prisma.verificationCode.findUnique({
            where: {
                id: token,
            },
        });

        return verificationCode ?? null;
    }
}

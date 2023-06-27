import { Schema, model } from "mongoose";

const VerificationCodeSchema = new Schema(
    {
        credential: { type: String, required: true },
        credentialType: { type: String, enum: ["email", "phone"], required: true },
        code: { type: String, required: true },
        ttl: { type: Date, default: () => Date.now() + 1000 * 60 * 2, expires: 0 },
    },
    {
        timestamps: true,
    }
);

export const VerificationCodeModel = model("VerificationCode", VerificationCodeSchema);

import { Schema, model } from "mongoose";
import { VerificationCode } from "../../../domain/entities/verification_code";

const VerificationCodeSchema = new Schema(
    {
        credential: { type: String, required: true },
        credentialType: { type: String, enum: ["email", "phone"], required: true },
        code: { type: String, required: true },
        ttl: { type: Date, default: () => Date.now() + 1000 * 60 * 2, expires: 0 },
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export const VerificationCodeModel = model<VerificationCode>("VerificationCode", VerificationCodeSchema);

import { Schema, model } from "mongoose";

// export type VerificationCode = {
//     id: string;
//     credential: string;
//     credentialType: "email" | "phone";
//     code: string;
//     createdAt: Date;
//     updatedAt: Date;
// };

const VerificationCodeSchema = new Schema(
    {
        credential: { type: String, required: true },
        credentialType: { type: String, enum: ["email", "phone"], required: true },
        code: { type: String, required: true },
        ttl: { type: Date, default: () => Date.now() + 1000 * 60 * 2, expires: 0 },
    },
    {
        timestamps: true,
        // virtuals: {
        //     toEntity: {
        //         get: function (this: any): VerificationCode {
        //             return {
        //                 id: this.id,
        //                 credential: this.credential,
        //                 credentialType: this.credentialType,
        //                 code: this.code,
        //                 createdAt: this.createdAt,
        //                 updatedAt: this.updatedAt,
        //             };
        //         },
        //     },
        // },
    }
);

export const VerificationCodeModel = model("VerificationCode", VerificationCodeSchema);

import { Schema, model } from "mongoose";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};




const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phoneVerified: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        virtuals: {
            toEntity: {
                get: function (this: any): User {
                    return {
                        id: this.id,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        phone: this.phone,
                        email: this.email,
                        phoneVerified: this.phoneVerified,
                        emailVerified: this.emailVerified,
                        createdAt: this.createdAt,
                        updatedAt: this.updatedAt,
                    };
                },
            }
        },
    }
);

export const UserModel = model("User", UserSchema);

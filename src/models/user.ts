import { Schema, model } from "mongoose";

export type UserData = {
    id: string;
    name: string;
    phone: string;
    email: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type UserCredentials = {
    id: string;
    phone: string;
    email: string;
    password: string;
};

export type User = UserData & UserCredentials;

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        phoneVerified: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        virtuals: {
            toUserData: {
                get: function (this: any): UserData {
                    return {
                        id: this.id,
                        name: this.name,
                        phone: this.phone,
                        email: this.email,
                        phoneVerified: this.phoneVerified,
                        emailVerified: this.emailVerified,
                        createdAt: this.createdAt,
                        updatedAt: this.updatedAt,
                    };
                },
            },
            toCredentials: {
                get: function (this: any): UserCredentials {
                    return {
                        id: this.id,
                        phone: this.phone,
                        email: this.email,
                        password: this.password,
                    };
                },
            },
        },
    }
);

export const UserModel = model("User", UserSchema);

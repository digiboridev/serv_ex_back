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
            id: {
                get: function (this: any): string {
                    return this._id;
                },
            },
            createdAt: {
                get: function (this: any): Date {
                    return this.createdAt;
                },
            },
            updatedAt: {
                get: function (this: any): Date {
                    return this.updatedAt;
                },
            },
        },
    }
);

export const UserModel = model("User", UserSchema);

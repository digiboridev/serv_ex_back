import { Schema, model } from "mongoose";

export type UserContact = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
};

const UserContactSchema = new Schema(
    {
        userId: { type: String, required: true, ref: "User" },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
    },
    {
        timestamps: true,
        virtuals: {
            toEntity: {
                get: function (this: any): UserContact {
                    return {
                        id: this.id,
                        userId: this.userId,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        phone: this.phone,
                    };
                },
            },
        },
    }
);

export const UserContactModel = model("UserContact", UserContactSchema);

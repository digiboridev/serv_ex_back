import { Schema, model } from "mongoose";

export interface Session {
    id: string;
    user: string;
    createdAt: Date;
    updatedAt: Date;
}

const SessionSchema = new Schema(
    {
        user: { type: String, required: true, ref: "User" },
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

export const SessionModel = model("Session", SessionSchema);

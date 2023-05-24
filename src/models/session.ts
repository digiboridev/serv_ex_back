import { Schema, model } from "mongoose";

export type Session = {
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
    }
);

export const SessionModel = model<Session>("Session", SessionSchema);

import { Schema, model } from "mongoose";

export type Session = {
    id: string;
    user: string;
    createdAt: Date;
    updatedAt: Date;
};

const SessionSchema = new Schema(
    {
        user: { type: String, required: true, ref: "User" },
        ttl: {
            type: Date,
            default: () => {
                const now = new Date();
                now.setFullYear(now.getFullYear() + 1);
                return now;
            },
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const SessionModel = model<Session>("Session", SessionSchema);

import { Schema, model } from "mongoose";

export type Session = {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

const SessionSchema = new Schema(
    {
        userId: { type: String, required: true },
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

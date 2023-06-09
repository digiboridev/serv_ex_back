import { Schema, model } from "mongoose";

export type Session = {
    id: string;
    entityId: string;
    scope: "client" | "vendor";
    createdAt: Date;
    updatedAt: Date;
};

const SessionSchema = new Schema(
    {
        entityId: { type: String, required: true },
        scope: { type: String, enum: ["client", "vendor"], required: true },
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

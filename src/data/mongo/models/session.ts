import { Schema, model } from "mongoose";
import { Session } from "../../../domain/entities/session";



const SessionSchema = new Schema(
    {
        entityId: { type: String, required: true },
        scope: { type: String, enum: ["customer", "vendor"], required: true },
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

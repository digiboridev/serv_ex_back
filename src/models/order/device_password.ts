import { Schema } from "mongoose";

export type DevicePassword = {
    type: "pattern" | "numeric";
    password?: string;
    dimensions?: number;
    points?: number[];
};

export const DevicePasswordSchema = new Schema(
    {
        type: { type: String, enum: ["pattern", "numeric"], required: true },
        password: String,
        dimensions: Number,
        points: [Number],
    },
    {
        _id: false,
        discriminatorKey: "type",
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);

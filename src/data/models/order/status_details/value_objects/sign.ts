import { Schema } from "mongoose";

export const OrderSignSchema = new Schema(
    {
        namePath: { type: String, required: true },
        signPath: { type: String, required: true },
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);

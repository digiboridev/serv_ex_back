import { Schema } from "mongoose";
import { OrderSignSchema } from "./sign";

export const OrderWorkFinishedDetailsSchema = new Schema(
    {
        employeeId: { type: String, required: false },
        finishedAfter: {
            type: String,
            enum: ["diagnistic", "offer"],
            required: true,
        },
        paymentRequired: { type: Boolean, required: true },
        signRequested: { type: Boolean, required: true },
        signnature: { type: OrderSignSchema, required: false },
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

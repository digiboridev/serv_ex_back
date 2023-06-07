import { Schema } from "mongoose";
import { OrderSign, OrderSignSchema } from "./value_objects/sign";

export enum FinishedAfterType {
    diagnistic = "diagnistic",
    offer = "offer",
}

export type OrderWorkFinishedDetails = {
    employeeId?: string;
    finishedAfter: FinishedAfterType;
    paymentRequired: boolean;
    signRequested: boolean;
    signnature? : OrderSign;
};

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

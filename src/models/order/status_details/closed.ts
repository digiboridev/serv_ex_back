import { Schema } from "mongoose";
import { OrderSign, OrderSignSchema } from "./value_objects/sign";

export type OrderClosedDetails = {
    employeeId: string;
    sign: OrderSign;
};

export const OrderClosedDetailsSchema = new Schema(
    {
        employeeId: { type: String, required: true },
        sign: { type: OrderSignSchema, required: true },
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

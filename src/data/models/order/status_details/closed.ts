import { Schema } from "mongoose";
import { OrderSignSchema } from "./value_objects/sign";

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

import { Schema } from "mongoose";
import { DevicePasswordSchema } from "./device_password";
import { OrderDetails } from "../../../domain/entities/order/order_details";

export const OrderDetailsSchema = new Schema(
    {
        categoryId: { type: String, required: true },
        issueIds: {
            type: [String],
            minlength: 1,
            required: true,
        },
        description: { type: String, required: true },
        deviceWet: { type: Boolean, required: true },
        wetDescription: {
            type: String,
            required: [
                function (this: OrderDetails) {
                    return this.deviceWet;
                },
                "Wet description is required when device is wet",
            ],
        },
        accesoriesIncluded: { type: Boolean, required: true },
        accesoriesDescription: {
            type: String,
            required: [
                function (this: OrderDetails) {
                    return this.accesoriesIncluded;
                },
                "Accesories description is required when accesories are included",
            ],
        },
        hasWaranty: { type: Boolean, required: true },
        password: { type: DevicePasswordSchema, required: false },
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

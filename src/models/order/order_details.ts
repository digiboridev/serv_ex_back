import { Schema } from "mongoose";
import { DevicePassword, DevicePasswordSchema } from "./device_password";

export type OrderDetails = {
    categoryId: string;
    issueIds: string[];
    description: string;
    deviceWet: boolean;
    wetDescription?: string;
    accesoriesIncluded: boolean;
    accesoriesDescription?: string;
    hasWaranty: boolean;
    password: DevicePassword;
};

export const OrderDetailsSchema = new Schema(
    {
        categoryId: { type: String, required: true },
        issueIds: {
            type: Array,
            items: { type: String, required: true },
            required: true,
        },
        description: { type: String, required: true },
        deviceWet: { type: Boolean, required: true },
        wetDescription: { type: String, required: false },
        accesoriesIncluded: { type: Boolean, required: true },
        accesoriesDescription: { type: String, required: false },
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

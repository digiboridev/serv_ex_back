import { Schema } from "mongoose";
import {  RepairPartSchema } from "./repair_parts";


export const OrderConfirmedOfferDetailsSchema = new Schema(
    {
        confirmationSkipped: { type: Boolean, required: true },
        parts: { type: [RepairPartSchema], required: true },
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

import { Schema } from "mongoose";
import { RepairPart, RepairPartSchema } from "./value_objects/repair_parts";



export type OrderConfirmedOfferDetails = {
    confirmationSkipped: boolean;
    parts: RepairPart[];
};


export const OrderConfirmedOfferDetailsSchema = new Schema(
    {
        confirmationSkipped: { type: Boolean, required: true },
        parts: { type: Array, items: { type: RepairPartSchema, required: true }, required: true },
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            }
        }
    }
);
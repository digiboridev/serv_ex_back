import { Schema } from "mongoose";
import { RepairPartSchema } from "./repair_parts";

export const OrderOfferCreatedDetailsSchema = new Schema(
    {
        employeeId: { type: String, required: true },
        employeeNick: { type: String, required: true },
        confirmationRequired: { type: Boolean, required: true },
        withPayment: { type: Boolean, required: true },
        prepayRequired: { type: Boolean, required: true },
        noteForClient: { type: String, required: true },
        noteForEmployee: { type: String, required: true },
        afterDiagnostic: { type: Boolean, required: true },
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

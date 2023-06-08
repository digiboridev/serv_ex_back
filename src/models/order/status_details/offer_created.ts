import { Schema } from "mongoose";
import { RepairPart, RepairPartSchema } from "./value_objects/repair_parts";

export type OrderOfferCreatedDetails = {
    employeeId: string;
    employeeNick: string;
    confirmationRequired: boolean;
    withPayment: boolean;
    prepayRequired: boolean;
    noteForClient: string;
    noteForEmployee: string;
    afterDiagnostic: boolean;
    parts: RepairPart[];
};

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

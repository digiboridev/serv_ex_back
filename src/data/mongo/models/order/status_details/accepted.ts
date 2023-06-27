import { Schema } from "mongoose";

export const OrderAcceptDetailsSchema = new Schema(
    {
        deviceName: { type: String, required: true },
        problemDescription: { type: String, required: true },
        conditionDescription: { type: String, required: true },
        diagnosticRequired: { type: Boolean, required: true },
        deviceImage: { type: String, required: true },
        employeeId: { type: String, required: true },
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

import { Schema } from "mongoose";
import { OrderCancellDetails } from "../../../../../domain/entities/order/status_details/cancelled";

export const OrderCancellDetailsSchema = new Schema(
    {
        reason: {
            type: String,
            enum: ["notAvailable", "notInterested", "notWorking", "notWorthRepair", "other"],
            required: true,
        },
        description: {
            type: String,
            required: [
                function (this: OrderCancellDetails) {
                    return this.reason === "other";
                },
                "description is required for other reason",
            ],
        },
        actor: {
            type: String,
            enum: ["customer", "employee"],
            required: true,
        },
        employeeId: {
            type: String,
            required: [
                function (this: OrderCancellDetails) {
                    return this.actor === "employee";
                },
                "employeeId is required for employee cancellations",
            ],
        },
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

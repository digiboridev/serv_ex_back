import { Schema } from "mongoose";

export enum CancellationReasons {
    notAvailable = "notAvailable",
    notInterested = "notInterested",
    notWorking = "notWorking",
    notWorthRepair = "notWorthRepair",
    other = "other",
}

export type OrderCancelledByCustomer = {
    reason: CancellationReasons;
    description?: string;
    actor: "customer";
};

export type OrderCancelledByEmployee = {
    reason: CancellationReasons;
    description?: string;
    actor: "employee";
    employeeId: string;
};

export type OrderCancellDetails = OrderCancelledByCustomer | OrderCancelledByEmployee;

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

import { Schema } from "mongoose";

export enum CancellationReasons {
    notAvailable = "notAvailable",
    notInterested = "notInterested",
    notWorking = "notWorking",
    notWorthRepair = "notWorthRepair",
    other = "other",
}

export enum CancelledActor {
    customer = "customer",
    employee = "employee",
}

export type OrderCancellDetails = {
    reason: CancellationReasons;
    description?: string;
    actor: CancelledActor;
    employeeId?: string;
};

export const OrderCancellDetailsSchema = new Schema(
    {
        reason: {
            type: String,
            enum: ["notAvailable", "notInterested", "notWorking", "notWorthRepair", "other"],
            required: true,
        },
        description: { type: String },
        actor: {
            type: String,
            enum: ["customer", "employee"],
            required: true,
        },
        employeeId: { type: String },
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

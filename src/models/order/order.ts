import { Schema, model } from "mongoose";
import { CustomerInfo, CustomerInfoSchema } from "./customer_info";
import { OrderDetails, OrderDetailsSchema } from "./order_details";
import { OrderStatus, OrderStatusSchema } from "./order_status";

export type Order = {
    id: string;
    customerInfo: CustomerInfo;
    details: OrderDetails;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
};

export enum PaymentStatus {
    notPaid = "notPaid",
    paid = "paid",
}

export enum DeviceLocation {
    client = "client",
    laboratory = "laboratory",
}

const OrderSchema = new Schema(
    {
        customerInfo: { type: CustomerInfoSchema, required: true },
        details: { type: OrderDetailsSchema, required: true },
        status: OrderStatusSchema,
        paymentStatus: {
            type: String,
            enum: ["notPaid", "paid"],
            default: "notPaid",
        },
        deviceLocation: {
            type: String,
            enum: ["client", "laboratory"],
            default: "client",
        },
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export const OrderModel = model("Order", OrderSchema);

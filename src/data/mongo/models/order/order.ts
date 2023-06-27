import { Schema, model } from "mongoose";
import { Order } from "../../../../domain/entities/order/order";
import { CustomerInfoSchema } from "./customer_info";
import { OrderDetailsSchema } from "./order_details";
import { OrderStatusSchema } from "./order_status";


const OrderSchema = new Schema(
    {
        customerInfo: { type: CustomerInfoSchema, required: true },
        details: { type: OrderDetailsSchema, required: true },
        status: {
            type: OrderStatusSchema,
            default: {},
        },
        paymentStatus: {
            type: String,
            enum: ["notPaid", "paid"],
            default: "notPaid",
        },
        deviceLocation: {
            type: String,
            enum: ["customer", "laboratory"],
            default: "customer",
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

export const OrderModel = model<Order>("Order", OrderSchema);

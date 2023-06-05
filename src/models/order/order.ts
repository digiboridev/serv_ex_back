import { Schema, model } from "mongoose";
import { CustomerInfo, CustomerInfoSchema } from "./customer_info";
import { OrderDetails, OrderDetailsSchema } from "./order_details";

export type Order = {
    id: string;
    customerInfo: CustomerInfo;
    details: OrderDetails;
    createdAt: Date;
    updatedAt: Date;
};

const OrderSchema = new Schema(
    {
        customerInfo: { type: CustomerInfoSchema, required: true },
        details: { type: OrderDetailsSchema, required: true },
    },
    {
        timestamps: true,
        virtuals: {
            toEntity: {
                get: function (this: any): Order {
                    return {
                        id: this.id,
                        customerInfo: this.customerInfo.toEntity,
                        details: this.details.toEntity,
                        createdAt: this.createdAt,
                        updatedAt: this.updatedAt,
                    };
                },
            },
        },
    }
);

export const OrderModel = model("Order", OrderSchema);

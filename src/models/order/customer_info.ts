import { Schema } from "mongoose";

export enum CustomerType {
    personal = "personal",
    company = "company",
}

export type CustomerInfo = {
    customerType: CustomerType;
    customerId: string;
};

export const CustomerInfoSchema = new Schema(
    {
        customerType: { type: String, enum: ["personal", "company"], required: true },
        customerId: { type: String, required: true },
    },
    {
        _id: false,
        virtuals: {
            toEntity: {
                get: function (this: any): CustomerInfo {
                    return {
                        customerType: this.customerType,
                        customerId: this.customerId,
                    };
                },
            },
        },
    }
);
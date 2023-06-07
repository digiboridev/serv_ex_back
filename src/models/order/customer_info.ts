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
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);



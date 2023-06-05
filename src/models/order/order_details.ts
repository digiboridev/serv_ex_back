

import { Schema } from "mongoose";

export type OrderDetails = {
    categoryId: string;
    issueIds: string[];
    description: string;
    deviceWet: boolean;
    wetDescription: string;
    accesoriesIncluded: boolean;
    accesoriesDescription: string;
    hasWaranty: boolean;
};

export const OrderDetailsSchema = new Schema(
    {
        categoryId: { type: String, required: true },
        issueIds: [{ type: String, required: true }],
        description: { type: String, required: true },
        deviceWet: { type: Boolean, required: true },
        wetDescription: { type: String, required: true },
        accesoriesIncluded: { type: Boolean, required: true },
        accesoriesDescription: { type: String, required: true },
        hasWaranty: { type: Boolean, required: true },
    },
    {
        _id: false,
        virtuals: {
            toEntity: {
                get: function (this: any): OrderDetails {
                    return {
                        categoryId: this.categoryId,
                        issueIds: this.issueIds,
                        description: this.description,
                        deviceWet: this.deviceWet,
                        wetDescription: this.wetDescription,
                        accesoriesIncluded: this.accesoriesIncluded,
                        accesoriesDescription: this.accesoriesDescription,
                        hasWaranty: this.hasWaranty,
                    };
                },
            },
        },
    }
);

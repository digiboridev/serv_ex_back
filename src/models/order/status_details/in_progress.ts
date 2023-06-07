import { Schema } from "mongoose";


export type OrderInProgressDetails = {
    employeeId : string;
};

export const OrderInProgressDetailsSchema = new Schema(
    {
        employeeId: { type: String, required: true },
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            }
        }
    }
);

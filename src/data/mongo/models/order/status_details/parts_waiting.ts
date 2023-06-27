import { Schema } from "mongoose";


export const OrderWaitingForPartsDetailsSchema = new Schema(
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

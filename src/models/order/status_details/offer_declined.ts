import { Schema } from "mongoose";


export type OrderDeclinedOfferDetails = {
    afterDiagnostic: boolean;
};

export const OrderDeclinedOfferDetailsSchema = new Schema(
    {
        afterDiagnostic: { type: Boolean, required: true },
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

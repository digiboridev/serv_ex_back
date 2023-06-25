import { Schema, model } from "mongoose";
import { UserContact } from "../../domain/entities/user_contacts";

const UserContactSchema = new Schema(
    {
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
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

export const UserContactModel = model<UserContact>("UserContact", UserContactSchema);

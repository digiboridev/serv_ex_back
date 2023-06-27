import { Schema, model } from "mongoose";
import { Company } from "../../../domain/entities/company";


const CompanySchema = new Schema(
    {   
        name: { type: String, required: true, },
        email: { type: String, required: true, unique: true },
        publicId: { type: String, required: true, unique: true },
        membersIds: [{ type: String, required: true}],
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

CompanySchema.virtual("members", {
    ref: "User",
    localField: "membersIds",
    foreignField: "_id",
    justOne: false,
});

export const CompanyModel = model<Company>("Company", CompanySchema);

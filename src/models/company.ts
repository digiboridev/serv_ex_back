import { Schema, model } from "mongoose";

export type Company = {
    id: string;
    name: string;
    email: string;
    publicId: string;
    membersIds: string[];
    createdAt: Date;
    updatedAt: Date;
};

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

export const CompanyModel = model("Company", CompanySchema);

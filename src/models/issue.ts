import { Schema, model } from "mongoose";

export type Issue = {
    id: string;
    title: string;
    description: string;
};

const IssueSchema = new Schema(
    {
        title: { type: String, required: true, minLength: 3 },
        description: { type: String, required: true, minLength: 3 },
    },
    {
        timestamps: false,
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

export const IssueModel = model("Issue", IssueSchema);

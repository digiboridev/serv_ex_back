import { Schema, model } from "mongoose";
import { Issue } from "../../../domain/entities/issue";

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

IssueSchema.index({ title: 1 }, { unique: true });

export const IssueModel = model<Issue>("Issue", IssueSchema);

import { Schema, model } from "mongoose";
import { Issue } from "./issue";

export type Category = {
    id: string;
    name: string;
    imageUri?: string;
    parentId?: string;
    issuesIds: string[];
};

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, minLength: 3 },
        imageUri: { type: String, required: false },
        parentId: { type: String, required: false },
        issuesIds: [{ type: String, required: true }],
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

CategorySchema.virtual("parent", {
    ref: "Category",
    localField: "parentId",
    foreignField: "_id",
    justOne: true,
});

CategorySchema.virtual("issues", {
    ref: "Issue",
    localField: "issuesIds",
    foreignField: "_id",
    justOne: false,
});

export const CategoryModel = model("Category", CategorySchema);

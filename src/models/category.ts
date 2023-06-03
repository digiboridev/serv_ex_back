import { Schema, model } from "mongoose";

export type Category = {
    id: string;
    name: string;
    imageUri?: string;
    parent?: string;
    issues: string[];
};

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, minLength: 3 },
        imageUri: { type: String, required: false },
        parent: { type: String, required: false, ref: "Category" },
        issues: [{ type: String, ref: "Issue" }],
    },
    {
        timestamps: false,
        virtuals: {
            toEntity: {
                get: function (this: any): Category {
                    return {
                        id: this.id,
                        name: this.name,
                        imageUri: this.imageUri,
                        parent: this.parent,
                        issues: this.issues,
                    };
                },
            },
        },
    }
);

export const CategoryModel = model("Category", CategorySchema);

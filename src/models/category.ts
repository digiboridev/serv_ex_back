import { Schema, model } from "mongoose";


export type Category = {
    id: string;
    name: string;
    imageUri?: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
};


const CategorySchema = new Schema(
    {
        name: { type: String, required: true, minLength: 3 },
        imageUri: { type: String, required: false },
        parentId: { type: String, required: false },
    },
    {
        timestamps: true,
        virtuals: {
            toEntity: {
                get: function (this: any): Category {
                    return {
                        id: this.id,
                        name: this.name,
                        imageUri: this.imageUri,
                        parentId: this.parentId,
                        createdAt: this.createdAt,
                        updatedAt: this.updatedAt,
                    };
                }
            }
        },
    }
);

export const CategoryModel = model("Category", CategorySchema);
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
        virtuals: {
            toEntity: {
                get: function (this: any): Issue {
                    return {
                        id: this.id,
                        title: this.title,
                        description: this.description,
                    };
                }
            }
        },
    }
);

export const IssueModel = model("Issue", IssueSchema);
    

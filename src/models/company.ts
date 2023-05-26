import { Schema, model } from "mongoose";

export type Company = {
    id: string;
    name: string;
    email: string;
    publicId: string;
    members: string[];
    createdAt: Date;
    updatedAt: Date;
};

const CompanySchema = new Schema(
    {   
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        publicId: { type: String, required: true, unique: true },
        members: [{ type: String, ref: "User" }],
    },
    {
        timestamps: true,
        virtuals: {
            toCompany: {
                get: function (this: any): Company {
                    return {
                        id: this.id,
                        name: this.name,
                        email: this.email,
                        publicId: this.publicId,
                        members: this.members,
                        createdAt: this.createdAt,
                        updatedAt: this.updatedAt,
                    };
                },
            },
        },
    }
);

export const CompanyModel = model("Company", CompanySchema);

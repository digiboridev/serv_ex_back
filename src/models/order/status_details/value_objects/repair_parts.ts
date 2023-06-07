import { Schema } from "mongoose";

export type RepairSubpart = {
    name: string;
    date: Date;
    price: number;
    note: string;
};

export type RepairPart = {
    name: string;
    date: Date;
    price: number;
    subparts: RepairSubpart[];
    note: string;
    selected: boolean;
};

export const RepairSubpartSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        price: { type: Number, required: true },
        note: { type: String, required: true },
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);

export const RepairPartSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        price: { type: Number, required: true },
        subparts: { type: Array, items: { type: RepairSubpartSchema, required: true }, required: true },
        note: { type: String, required: true },
        selected: { type: Boolean, required: true },
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);

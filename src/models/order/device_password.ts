import { Schema } from "mongoose";

export type DevicePatternPassword = {
    type: "pattern";
    dimensions: number;
    points: number[];
};

export type DeviceNumericPassword = {
    type: "numeric";
    password: string;
};

export type DevicePassword = DevicePatternPassword | DeviceNumericPassword;

export const DevicePasswordSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["pattern", "numeric"],
            required: true,
        },
        dimensions: {
            type: Number,
            required: function (this: DevicePassword) {
                return this.type === "pattern";
            },
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value",
            },
        },
        points: {
            type: [
                {
                    type: Number,
                    validate: [
                        {
                            validator: Number.isInteger,
                            message: "{VALUE} is not an integer value",
                        },
                        {
                            validator: function (this: DevicePatternPassword, value: number) {
                                return value >= 0 && value <= this.dimensions * this.dimensions;
                            },
                            message: "{VALUE} is not a valid point for this pattern",
                        },
                    ],
                },
            ],
            required: function (this: DevicePassword) {
                return this.type === "pattern";
            },
        },
        password: {
            type: String,
            required: function (this: DevicePassword) {
                return this.type === "numeric";
            },
        },
    },
    {
        _id: false,
        discriminatorKey: "type",
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);

import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phoneVerified: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        password: { type: String, select: false },
    },
    { timestamps: true }
);

export const UserModel = model("User", UserSchema);

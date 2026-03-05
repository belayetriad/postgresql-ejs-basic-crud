import mongoose, { Schema } from "mongoose";

export interface IUser {
  full_name: string;
  email: string;
  password_hash: string;
  role: "USER" | "ADMIN";
}

const UserSchema = new Schema<IUser>(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
      index: true,
    },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);

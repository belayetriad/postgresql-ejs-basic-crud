import mongoose, { Schema } from "mongoose";

export interface IStudent {
  first_name: string;
  last_name: string;
  roll: string;
  registration: string;
  email: string;
  address: string;
}

const StudentSchema = new Schema<IStudent>(
  {
    first_name: { type: String, required: true, trim: true, maxlength: 100 },
    last_name: { type: String, required: true, trim: true, maxlength: 100 },
    roll: { type: String, required: true, trim: true, maxlength: 50 },
    registration: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, maxlength: 150 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

export const Student = mongoose.model<IStudent>("Student", StudentSchema);

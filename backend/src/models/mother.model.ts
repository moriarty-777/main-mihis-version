import { model, Schema } from "mongoose";

export interface Mother {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  purok?: string;
  barangay: string;
  phone?: string;
  email?: string;
  photoPath?: string;
  children?: Schema.Types.ObjectId[];
  isTransient?: boolean;
}

// Define the Mother schema
const MotherSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: false },
    purok: { type: String, required: false },
    barangay: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    photoPath: { type: String, required: false },
    children: [{ type: Schema.Types.ObjectId, ref: "child", required: false }],
    isTransient: { type: Boolean, required: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Create and export the User model
export const MotherModel = model<Mother>("mother", MotherSchema);

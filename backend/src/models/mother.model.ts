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
    barangay: { type: String, required: true }, // Either Gmail or phone number, must be unique
    phone: { type: String, required: false },
    email: { type: String, required: false }, // Consider changing to Date if performing date operations
    photoPath: { type: String, required: false }, // Optional secret key for future use
    children: [{ type: Schema.Types.ObjectId, ref: "child", required: false }], // Array of ObjectIds
    isTransient: { type: Boolean, required: false }, // Ensure this is hashed before storing
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

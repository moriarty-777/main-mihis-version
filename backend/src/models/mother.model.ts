import { model, Schema } from "mongoose";

export interface Mother {
  id: string;
  firstName: string;
  lastName: string;
  barangay: string;
  isTransient?: boolean;
  email?: string;
  phone?: string;
  purok?: string;
  photoPath?: string;
  children?: Schema.Types.ObjectId[];
}

// Define the Mother schema
const MotherSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    barangay: { type: String, required: true }, // Either Gmail or phone number, must be unique
    isTransient: { type: Boolean, required: false }, // Ensure this is hashed before storing
    email: { type: String, required: false }, // Consider changing to Date if performing date operations
    phone: { type: String, required: false },
    purok: { type: String, required: false },
    photoPath: { type: String, required: false }, // Optional secret key for future use
    children: [{ type: Schema.Types.ObjectId, ref: "Child", required: false }], // Array of ObjectIds
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

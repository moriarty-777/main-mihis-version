import { model, Schema } from "mongoose";

export interface Mother {
  id: string;
  firstName: string;
  lastName: string;
  barangay: string;
  isTransient: boolean;
  email?: string;
  phone?: string;
  purok: string;
  photoPath?: string;
  children?: Schema.Types.ObjectId[];
}

// Define the Mother schema
const MotherSchema = new Schema(
  {
    role: { type: String, required: false }, // BHW, Midwife, Admin
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Either Gmail or phone number, must be unique
    password: { type: String, required: true }, // Ensure this is hashed before storing
    dateOfService: { type: Date, required: false }, // Consider changing to Date if performing date operations
    gender: { type: String, required: false },
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

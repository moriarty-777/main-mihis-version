// // Old Schema
import { model, Schema } from "mongoose";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  role?: string; // BHW, Midwife, Admin
  photoPath?: string;
  dateOfService?: string;
  username: string; // Either Gmail or phone number
  password: string;
  shift?: string[]; // e.g., 'Morning', 'Afternoon'
  daySchedule?: string[]; // e.g., ['Monday', 'Tuesday']
}

// Define the User schema
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: false },
    role: { type: String, required: false }, // BHW, Midwife, Admin
    photoPath: { type: String, required: false }, // Optional secret key for future use
    dateOfService: { type: Date, required: false }, // Consider changing to Date if performing date operations
    username: { type: String, required: true, unique: true }, // Either Gmail or phone number, must be unique
    password: { type: String, required: true }, // Ensure this is hashed before storing
    shift: {
      type: [String],
      required: false,
      default: "morning",
    },
    daySchedule: { type: [String], required: false, default: [] },
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
export const UserModel = model<User>("user", UserSchema);

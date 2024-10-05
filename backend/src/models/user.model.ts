// // Old Schema
import { model, Schema } from "mongoose";

export interface User {
  id: string;
  role?: string; // BHW, Midwife, Admin
  firstName: string;
  lastName: string;
  username: string; // Either Gmail or phone number
  password: string;
  dateOfService?: string;
  gender?: string;
  photoPath?: string;
  secretKey?: string;
  shift?: string[]; // e.g., 'Morning', 'Afternoon'
  daySchedule?: string[]; // e.g., ['Monday', 'Tuesday']
}

// Define the User schema
const UserSchema = new Schema(
  {
    role: { type: String, required: false }, // BHW, Midwife, Admin
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Either Gmail or phone number, must be unique
    password: { type: String, required: true }, // Ensure this is hashed before storing
    dateOfService: { type: Date, required: false }, // Consider changing to Date if performing date operations
    gender: { type: String, required: false },
    photoPath: { type: String, required: false }, // Optional secret key for future use
    secretKey: { type: String, required: false }, // Optional secret key for future use
    // shift: [{ type: String, required: false }],
    // daySchedule: [
    //   {
    //     type: String,
    //     required: false,
    //   },
    // ],
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

// New Schema Start
// TODO:
// import { model, Schema } from "mongoose";

// export interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   gender?: string;
//   role?: string; // e.g., 'BHW', 'Midwife', 'Admin'
//   photoPath?: string;
//   dateOfService?: Date;
//   username: string;
//   password: string;
//   shift?: string; // e.g., 'Morning', 'Afternoon'
//   daySchedule?: string[]; // e.g., ['Monday', 'Tuesday']
//   secretKey?: string;
// }

// // Define the User schema
// const UserSchema = new Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     gender: { type: String, required: false },
//     photoPath: { type: String, required: false },
//     dateOfService: { type: Date, required: false },
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     secretKey: { type: String, required: false },
//     role: {
//       type: String,
//       enum: ["bhw", "midwife", "admin", "pending"],
//       required: false,
//     },
//     shift: { type: String, enum: ["morning", "afternoon"], required: false },
//     daySchedule: [
//       {
//         type: String,
//         enum: [
//           "monday",
//           "tuesday",
//           "wednesday",
//           "thursday",
//           "friday",
//           "saturday",
//           "sunday",
//         ],
//       },
//     ],
//   },
//   {
//     toJSON: {
//       virtuals: true,
//     },
//     toObject: {
//       virtuals: true,
//     },
//     timestamps: true,
//   }
// );

// // // Create and export the User model
// export const UserModel = model<User>("User", UserSchema);

// TODO:

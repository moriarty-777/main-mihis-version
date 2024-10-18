import { model, Schema } from "mongoose";

// Anthropometric Data Interface
export interface Anthropometric {
  childId: Schema.Types.ObjectId; // Reference to the Child
  weightForAge:
    | "Severely Underweight"
    | "Underweight"
    | "Normal"
    | "Overweight"; // Weight-for-Age category
  heightForAge: "Severely Stunted" | "Stunted" | "Normal" | "Tall"; // Height-for-Age category
  weightForHeight:
    | "Severely Wasted"
    | "Wasted"
    | "Normal"
    | "Overweight"
    | "Obese"; // Weight-for-Height category
  dateOfWeighing: Date; // Date of the anthropometric measurement
  createdAt?: Date; // Timestamps will be automatically added by Mongoose
  updatedAt?: Date;
}

const AnthropometricSchema = new Schema(
  {
    childId: { type: Schema.Types.ObjectId, ref: "child", required: true }, // Reference to Child schema
    weightForAge: {
      type: String,
      enum: ["Severely Underweight", "Underweight", "Normal", "Overweight"],
      required: true,
    },
    heightForAge: {
      type: String,
      enum: ["Severely Stunted", "Stunted", "Normal", "Tall"],
      required: true,
    },
    weightForHeight: {
      type: String,
      enum: ["Severely Wasted", "Wasted", "Normal", "Overweight", "Obese"],
      required: true,
    },
    dateOfWeighing: { type: Date, default: Date.now, required: true }, // Date of the measurement
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
export const AnthropometricModel = model<Anthropometric>(
  "anthropometric",
  AnthropometricSchema
);

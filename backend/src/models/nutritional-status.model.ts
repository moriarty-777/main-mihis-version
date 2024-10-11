import { model, Schema } from "mongoose";

export interface NutritionalStatus {
  childId: Schema.Types.ObjectId; // Reference to the Child
  status: string; // Nutritional status
  dateOfStatus: Date; // Date of status assessment
  createdAt?: Date; // Timestamps will be automatically added by Mongoose
  updatedAt?: Date;
}

// Nutritional Status Schema
const NutritionalStatusSchema = new Schema(
  {
    childId: { type: Schema.Types.ObjectId, ref: "child", required: true },
    status: { type: String, required: true }, // Nutritional status
    dateOfStatus: { type: Date, default: Date.now, required: true }, // Date of status assessment
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

module.exports = model("nutritionalStatus", NutritionalStatusSchema);
// default: Date.now

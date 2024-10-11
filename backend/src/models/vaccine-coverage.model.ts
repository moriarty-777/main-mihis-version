import { model, Schema } from "mongoose";

export interface VaccineCoverage {
  vaccineName: string;
  doseNumber: string;
  administeredDate: Date;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  remarks?: string;
}

// Define the Vaccine Coverage schema
const VaccineCoverageSchema = new Schema(
  {
    vaccineName: { type: String, required: true },
    doseNumber: { type: String, required: true },
    administeredDate: { type: Date, required: true },
    maleCount: { type: Number, required: true, default: 0 },
    femaleCount: { type: Number, required: true, default: 0 },
    totalCount: { type: Number, required: true, default: 0 },
    remarks: { type: String, required: false },
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

// Create and export the Vaccine Coverage model
export const VaccineCoverageModel = model<VaccineCoverage>(
  "vaccineCoverage",
  VaccineCoverageSchema
);

import { Schema, model, Document } from "mongoose";

// Interface for Vaccination
export interface Vaccination extends Document {
  vaccineType: string;
  doseNumber: string;
  placeOfVaccination: string;
  dateOfVaccination: Date;
  midwifeId: Schema.Types.ObjectId; // Reference to the Midwife
  bhwId: Schema.Types.ObjectId; // Reference to the BHW
  aefi: Schema.Types.ObjectId; // Reference to the BHW
}

// Vaccination Schema
const VaccinationSchema = new Schema<Vaccination>(
  {
    vaccineType: { type: String, required: true },
    doseNumber: { type: String, required: true },
    placeOfVaccination: { type: String, required: true },
    dateOfVaccination: { type: Date, required: true },
    midwifeId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    bhwId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    aefi: { type: Schema.Types.ObjectId, ref: "aefi" }, // Link to AEFI schema
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

export const VaccinationModel = model<Vaccination>(
  "vaccination",
  VaccinationSchema
);

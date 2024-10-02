import { model, Schema } from "mongoose";

// Define the MissedVaccine schema
export interface MissedVaccine {
  childId: any; // Reference to the child who missed the vaccine
  vaccineName: string;
  reason: string; // Reason for missing the vaccine (e.g., health reasons, distance)
  dateMissed: Date;
}

const MissedVaccineSchema = new Schema<MissedVaccine>(
  {
    childId: { type: Schema.Types.ObjectId, ref: "child", required: true },
    vaccineName: { type: String, required: true },
    reason: { type: String, required: true },
    dateMissed: { type: Date, required: true },
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

export const MissedVaccineModel = model<MissedVaccine>(
  "missedVaccine",
  MissedVaccineSchema
);

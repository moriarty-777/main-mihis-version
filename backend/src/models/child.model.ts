import { model, Schema } from "mongoose";

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  purok: string;
  gender: string;
  weight: number;
  height: number;
  barangay: string;
  dateOfBirth: Date;
  photoPath: string;
  vaccinations: Vaccination[];
  isFullyVaccinated: boolean;
  dateFullyVaccinated: Date;
  weighingHistory: WeighingHistory[];
  // Optional: Add a field for computed nutritional status, if needed
  nutritionalStatus?: string;
  placeOfBirth?: string;
}

export interface Vaccination {
  vaccineType: string;
  doseNumber: string;
  placeOfVaccination: string;
  dateOfVaccination: string;
  midwifeId: string;
  bhwId: string;
  aefi?: {
    occurred: boolean;
    description?: string;
    severity?: string;
  };
}

export interface WeighingHistory {
  date: string;
  weight: number;
  height: number;
  weightForAgeStatus: string;
  heightForAgeStatus: string;
  weightForLengthHeightStatus: string;
  notes: string;
}

//
// Define the WeighingHistory schema
const WeighingHistorySchema = new Schema(
  {
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    weightForAgeStatus: { type: String, required: true },
    heightForAgeStatus: { type: String, required: true },
    weightForLengthHeightStatus: { type: String, required: true },
    notes: { type: String, required: false },
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

// Define the Vaccination schema
const VaccinationSchema = new Schema(
  {
    vaccineType: { type: String, required: true },
    doseNumber: { type: String, required: true },
    placeOfVaccination: { type: String, required: true },
    dateOfVaccination: { type: String, required: true },
    midwifeId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    bhwId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    aefi: {
      occurred: { type: Boolean, required: false },
      description: { type: String, required: false },
      severity: { type: String, required: false },
    },
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

// Define the Child schema
const ChildSchema = new Schema<Child>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    purok: { type: String, required: true },
    gender: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    barangay: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    photoPath: { type: String, required: false },
    vaccinations: { type: [VaccinationSchema], required: true },
    isFullyVaccinated: { type: Boolean, required: true },
    dateFullyVaccinated: { type: Date, required: false },
    weighingHistory: { type: [WeighingHistorySchema], required: true },
    nutritionalStatus: { type: String, required: false }, // Optional field
    placeOfBirth: { type: String, required: false }, // New optional field
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

//

export const ChildModel = model<Child>("child", ChildSchema);

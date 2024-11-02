import { model, Schema } from "mongoose";
import { AnthropometricModel } from "./anthropometric.model";
import { WeighingHistoryModel } from "./weighing-history.model";
import { NutritionalStatusModel } from "./nutritional-status.model";
import { MotherModel } from "./mother.model";
import { SchedulingModel } from "./scheduling.model";
import { VaccinationModel } from "./vaccination.model";

export interface Child {
  firstName: string;
  lastName: string;
  // height: number;
  // weight: number;
  heightAtBirth?: number;
  weightAtBirth?: number;
  dateOfBirth: Date;
  gender: string;
  purok: string;
  barangay: string;
  photoPath?: string;
  placeOfBirth?: string;
  weighingHistory: Schema.Types.ObjectId[];
  vaccinations: Schema.Types.ObjectId[];
  vaccineStatus?: Schema.Types.ObjectId;
  nutritionalStatus?: Schema.Types.ObjectId;
  anthropometricStatus?: Schema.Types.ObjectId;
  missedVaccines?: Schema.Types.ObjectId[];
  schedules: Schema.Types.ObjectId[];
  motherId: any;
}

// Define the Child schema
const ChildSchema: any = new Schema(
  {
    motherId: { type: Schema.Types.ObjectId, ref: MotherModel, required: true }, // Reference to the mother
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    weightAtBirth: { type: Number, required: false }, // Weight at birth
    heightAtBirth: { type: Number, required: false }, // Height at birth
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    purok: { type: String, required: true },
    barangay: { type: String, required: true },
    photoPath: { type: String, required: false },
    placeOfBirth: { type: String, required: false, default: "Margarito" },
    weighingHistory: [
      { type: Schema.Types.ObjectId, ref: WeighingHistoryModel },
    ],
    vaccinations: [{ type: Schema.Types.ObjectId, ref: VaccinationModel }],
    // vaccineStatus: { type: Schema.Types.ObjectId, ref: "vaccineStatus" },
    nutritionalStatus: {
      type: Schema.Types.ObjectId,
      ref: NutritionalStatusModel,
    },
    anthropometricStatus: {
      type: Schema.Types.ObjectId,
      ref: AnthropometricModel,
    },
    missedVaccines: [{ type: Schema.Types.ObjectId, ref: "missedVaccine" }],
    schedules: [{ type: Schema.Types.ObjectId, ref: SchedulingModel }],
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

// Create and export the Child model
export const ChildModel = model<Child>("child", ChildSchema);

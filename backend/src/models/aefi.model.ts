import { model, Schema } from "mongoose";

export interface Aefi extends Document {
  vaccineId: Schema.Types.ObjectId;
  description: string;
  severity: string;
  dateOfEvent: Date;
}

const AefiSchema = new Schema<Aefi>(
  {
    vaccineId: {
      type: Schema.Types.ObjectId,
      ref: "vaccination",
      required: true,
    },
    description: { type: String, required: true },
    severity: {
      type: String,

      required: true,
    },
    dateOfEvent: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

export const AefiModel = model<Aefi>("aefi", AefiSchema);
//   enum: ["Mild", "Moderate", "Severe"],

import { model, Schema } from "mongoose";

export interface WeighingHistory {
  child: Schema.Types.ObjectId;
  date: Date;
  weight: number;
  height: number;
  weightForAge: string;
  heightForAge: string;
  weightForLengthHeight: string;
  notes?: string;
}

const WeighingHistorySchema = new Schema(
  {
    child: { type: Schema.Types.ObjectId, ref: "child", required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    weightForAge: { type: String, required: true },
    heightForAge: { type: String, required: true },
    weightForLengthHeight: { type: String, required: true },
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

export const WeighingHistoryModel = model<WeighingHistory>(
  "weighingHistory",
  WeighingHistorySchema
);

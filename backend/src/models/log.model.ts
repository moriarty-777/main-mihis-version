import { model, Schema } from "mongoose";

export interface Log {
  userId: any;
  username: string;
  role: string; // e.g., 'bhw' or 'midwife'
  action: string; // e.g., 'edit', 'delete', 'add'
  timestamp: Date;
  duration?: number; // Optional: duration of the session in seconds
  ipAddress?: string; // Optional: Store IP address for more tracking
}

const LogSchema = new Schema<Log>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    username: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    duration: { type: Number, required: false },
    ipAddress: { type: String, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export const LogModel = model<Log>("log", LogSchema);

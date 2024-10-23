import { Schema, model } from "mongoose";
import { ChildModel } from "./child.model";

export interface Scheduling {
  id: string;
  childId: any; // Link to the child
  scheduleType: "weighing" | "vaccination"; // Type of event
  scheduleDate: Date; // Date for weighing or vaccination
  rescheduleDate?: Date; // Reschedule date if missed
  location: string; // Location of the event
  notificationSent?: boolean; // If notification was sent
  notificationDate?: Date; // Date when the SMS was sent
  notificationContent?: string; // Content of the SMS
  motherPhoneNumber: string; // Mother's phone number
  vaccineName?: string; // Name of the vaccine (for vaccination schedules)
  doseNumber?: number; // Dose number (for vaccines that require multiple doses)
  weighingDescription?: string; // Weighing description for events
  remarks?: string; // Additional notes if needed
}

// Scheduling Schema
const SchedulingSchema: any = new Schema(
  {
    childId: { type: Schema.Types.ObjectId, ref: "child", required: true }, // Link to the child
    scheduleType: {
      type: String,
      enum: ["weighing", "vaccination"],
      required: true,
    }, // Type of event
    scheduleDate: { type: Date, required: true }, // Date for weighing or vaccination
    rescheduleDate: { type: Date }, // Reschedule date if missed
    location: { type: String, required: true }, // Location of the event
    notificationSent: { type: Boolean, default: false }, // If notification was sent
    notificationDate: { type: Date }, // Date when the SMS was sent
    notificationContent: { type: String }, // Content of the SMS
    motherPhoneNumber: { type: String, required: true }, // Mother's phone number
    vaccineName: { type: String, required: false }, // Name of the vaccine (for vaccination schedules)
    doseNumber: { type: Number, required: false }, // Dose number (for vaccines that require multiple doses)
    weighingDescription: { type: String, required: false }, // Weighing description for events
    remarks: { type: String, default: "" }, // Additional notes if needed
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the Scheduling model
export const SchedulingModel = model<Scheduling>(
  "scheduling",
  SchedulingSchema
);

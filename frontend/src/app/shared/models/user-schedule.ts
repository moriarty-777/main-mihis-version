export interface Schedule {
  id: string;
  bhwId?: string; // Optional: Reference to the BHW (if applicable)
  midwifeId?: string; // Optional: Reference to the Midwife (if applicable)
  shift: string; // "Morning" or "Afternoon"
  day: string; // Day of the week (e.g., "Monday", "Tuesday")
  date: Date; // Specific date for the schedule
}

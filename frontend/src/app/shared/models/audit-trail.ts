export interface AuditTrail {
  id: string;
  userId: string; // Reference to the User (BHW, Midwife, Admin)
  role: string; // Role of the user who performed the action
  activity: string; // Description of what was done or modified
  dateTime: Date; // Combined date and time of the activity
  timeSpent: string; // Time spent in HH:MM:SS format
}

export class User {
  id!: any;
  role!: string; // BHW, Midwife, Admin
  firstName!: string;
  lastName!: string;
  username!: string; // Either Gmail or phone number
  token!: string;
  password!: string;
  dateOfService!: string;
  secretKey!: string;
  photoPath?: any;
  yearsOfService?: any;
  gender?: any;
  formattedDate?: any;
  _id?: any;

  // New Fields
  shift?: string; // "morning" or "afternoon"
  daySchedule?: string[]; // Days of the week ["monday", "tuesday", ...]
}

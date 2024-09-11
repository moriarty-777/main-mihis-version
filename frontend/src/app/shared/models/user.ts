export class User {
  id!: string;
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
  // dateOfService: Date;
}

// export interface User {
//   id: string;
//   role: string; // BHW, Midwife, Admin
//   firstName: string;
//   lastName: string;
//   // dateOfService: Date;
//   dateOfService: string;
//   username: string; // Either Gmail or phone number
//   password: string; // Hashed password
//   secretKey: string; // Used for validating roles like BHW and Midwife
//   token: string;
// }

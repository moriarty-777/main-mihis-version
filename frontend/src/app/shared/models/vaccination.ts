// export interface MidwifePopulated {
//   _id: string;
//   firstName: string;
//   lastName: string;
// }

export interface Vaccination {
  id: any;
  _id: any;
  vaccineType: string;
  doseNumber: string;
  placeOfVaccination: string;
  // dateOfVaccination: Date;
  dateOfVaccination: string;
  midwifeId: any; // Union type
  bhwId: any; // Reference to User (BHW)
  aefi?: {
    occurred: boolean;
    description?: string;
    severity?: string;
  };
}

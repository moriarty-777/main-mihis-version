export interface NutritionalStatusReport {
  id: string;
  childId: string; // Reference to the Child
  weightForAgeStatus: string;
  heightForAgeStatus: string;
  weightForLengthHeightStatus: string;
  date: Date; // Date of the report
}

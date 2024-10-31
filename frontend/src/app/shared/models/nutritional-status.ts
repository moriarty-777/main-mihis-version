export interface NutritionalStatus {
  id: any;
  _id: any;
  childId: string; // Reference to the child
  status: string; // Nutritional status (e.g., "Normal", "Malnourished")
  dateOfStatus: string; // Date of the status assessment
}

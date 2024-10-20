export interface NutritionalStatus {
  childId: string; // Reference to the child
  status: string; // Nutritional status (e.g., "Normal", "Malnourished")
  dateOfStatus: string; // Date of the status assessment
}

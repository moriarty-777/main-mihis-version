import { AnthropometricStatus } from './anthropometric';
import { NutritionalStatus } from './nutritional-status';
import { Vaccination } from './vaccination';
import { WeighingHistory } from './weighing-history';

export interface Child {
  id: string;
  motherId: any;
  schedules: any;
  firstName: string;
  lastName: string;
  purok: string;
  gender: string;
  weight: number;
  height: number;
  // dateOfBirth: Date;
  barangay: string;
  dateOfBirth: string;
  photoPath: string;
  vaccinations: Vaccination[];
  isFullyVaccinated: boolean;
  // dateFullyVaccinated: Date;
  dateFullyVaccinated: string;
  weighingHistory: WeighingHistory[]; // Add weighingHistory
  anthropometricStatus: AnthropometricStatus; // Add anthropometricStatus
  nutritionalStatus?: NutritionalStatus;
  vaccinationStatus?: any;
  mother?: any;
  child?: any;
}

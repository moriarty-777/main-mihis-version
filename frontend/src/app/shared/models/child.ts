import { AnthropometricStatus } from './anthropometric';
import { NutritionalStatus } from './nutritional-status';
import { Vaccination } from './vaccination';
import { WeighingHistory } from './weighing-history';

interface Schedule {
  scheduleDate: Date;
  rescheduleDate: Date;
  scheduleType: string;
  vaccineName?: string;
  doseNumber?: number;
  location: string;
}
export interface Child {
  id: string;
  motherId: any;
  schedules: Schedule[];
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
  weighingHistory: any; // Add weighingHistory
  anthropometricStatus: AnthropometricStatus; // Add anthropometricStatus
  nutritionalStatus?: NutritionalStatus;
  vaccinationStatus?: any;
  missedVaccines?: any;
  mother?: any;
  child?: any;
}

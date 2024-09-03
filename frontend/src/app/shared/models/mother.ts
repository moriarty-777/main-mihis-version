import { Child } from './child';

export interface Mother {
  id: string;
  firstName: string;
  lastName: string;
  barangay: string;
  isTransient: boolean;
  gmail: string;
  phone: string;
  purok: string;
  children: Child[]; // Array of Child objects
}

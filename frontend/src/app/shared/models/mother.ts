import { Child } from './child';

export interface Mother {
  id: string;
  firstName: string;
  lastName: string;
  barangay: string;
  isTransient: boolean;
  email: string;
  phone: string;
  purok: string;
  photoPath?: string;
  childrenCount?: any;
  gender?: any;
  children: Child[]; // Array of Child objects
}

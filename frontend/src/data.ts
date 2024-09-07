import { WeighingHistory } from './app/shared/models/weighing-history';
import { Child } from './app/shared/models/child';
import { Mother } from './app/shared/models/mother';
import { Vaccination } from './app/shared/models/vaccination';
import { User } from './app/shared/models/user';
import { NutritionalStatusReport } from './app/shared/models/nutritional-status-report';
import { AuditTrail } from './app/shared/models/audit-trail';
import { Schedule } from './app/shared/models/user-schedule';

export const child: Child[] = [
  {
    id: 'child1',
    motherId: 'mother1',
    firstName: 'Katleen',
    lastName: 'Dela Cruz',
    purok: '2',
    gender: 'Female',
    weight: 17,
    height: 98,
    barangay: 'Bangad',
    dateOfBirth: '2020-11-26',
    photoPath: 'assets/img/child-1.jpg',
    vaccinations: [
      {
        vaccineType: 'BCG',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2020-12-02',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Hepatitis B Vaccine',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2020-12-09',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Pentavalent Vaccine',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-02-03',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Oral Polio Vaccine (OPV)',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-02-03',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Pentavalent Vaccine',
        doseNumber: '2nd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-03-10',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Oral Polio Vaccine (OPV)',
        doseNumber: '2nd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-03-10',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Pentavalent Vaccine',
        doseNumber: '3rd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-04-14',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Oral Polio Vaccine (OPV)',
        doseNumber: '3rd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-04-14',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Inactivated Polio Vaccine (IPV)',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-04-14',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Inactivated Polio Vaccine (IPV)',
        doseNumber: '2nd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-07-28',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-02-03',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
        doseNumber: '2nd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-03-10',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
        doseNumber: '3rd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-04-14',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Measles, Mumps, Rubella Vaccine (MMR)',
        doseNumber: '1st Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-09-01',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
      {
        vaccineType: 'Measles, Mumps, Rubella Vaccine (MMR)',
        doseNumber: '2nd Dose',
        placeOfVaccination: 'Barangay Health Center',
        dateOfVaccination: '2021-11-24',
        midwifeId: 'midwife1',
        bhwId: 'bhw1',
      },
    ],
    isFullyVaccinated: true,
    dateFullyVaccinated: '2021-11-24',
    weighingHistory: [
      {
        date: '2024-01-25',
        weight: 17,
        height: 98,
        weightForAgeStatus: 'Normal',
        heightForAgeStatus: 'Normal',
        weightForLengthHeightStatus: 'Normal',
        notes: 'Annual check-up',
      },
    ],
  },
];
export const mother: Mother[] = [
  {
    id: 'mother1',
    firstName: 'Evangeline',
    lastName: 'Dela Cruz',
    barangay: 'Bangad',
    isTransient: false,
    email: 'evangeline.cruz@gmail.com',
    phone: '+639587485326',
    purok: '2',
    children: child.filter((child) => child.motherId === 'mother1'),
  },
];

export const nutritionalStatusReport: NutritionalStatusReport[] = [];
export const notification: Notification[] = [];
export const auditTrail: AuditTrail[] = [];
export const userSchedule: Schedule[] = [];

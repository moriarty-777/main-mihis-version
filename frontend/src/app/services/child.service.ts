import { Injectable, inject } from '@angular/core';
import { Child } from '../shared/models/child';
import { child } from '../../data';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CHILD_URL, CHILDREN_PROFILE_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<Child[]> {
    return this.http.get<Child[]>(CHILD_URL);
  }

  getAllChildrenBySearchTerm(searchTerm: string) {
    return this.getAll().pipe(
      map((children) =>
        children.filter((child) =>
          child.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  getChildrenById(id: string): Observable<Child> {
    return this.http.get<Child>(CHILDREN_PROFILE_URL + id);
  }

  // Original
  getExpectedVaccinationSchedule(birthdate: string) {
    const birthDateObj = new Date(birthdate);
    const schedule = [
      {
        vaccineType: 'BCG',
        doseNumber: '1st Dose',
        dateOfVaccination: birthDateObj, // At birth
        rescheduleDate: this.addOneWeekToNextWednesday(birthDateObj),
      },
      {
        vaccineType: 'Hepatitis B Vaccine',
        doseNumber: '1st Dose',
        dateOfVaccination: birthDateObj, // At birth
        rescheduleDate: this.addOneWeekToNextWednesday(birthDateObj),
      },
      {
        vaccineType: 'Pentavalent Vaccine',
        doseNumber: '1st Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 1.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 1.5))
        ),
      },
      {
        vaccineType: 'Pentavalent Vaccine',
        doseNumber: '2nd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 2.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 2.5))
        ),
      },
      {
        vaccineType: 'Pentavalent Vaccine',
        doseNumber: '3rd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 3.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
        ),
      },
      {
        vaccineType: 'Oral Polio Vaccine (OPV)',
        doseNumber: '1st Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 1.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 1.5))
        ),
      },
      {
        vaccineType: 'Oral Polio Vaccine (OPV)',
        doseNumber: '2nd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 2.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 2.5))
        ),
      },
      {
        vaccineType: 'Oral Polio Vaccine (OPV)',
        doseNumber: '3rd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 3.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
        ),
      },
      {
        vaccineType: 'Inactivated Polio Vaccine (IPV)',
        doseNumber: '1st Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 3.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
        ),
      },
      {
        vaccineType: 'Inactivated Polio Vaccine (IPV)',
        doseNumber: '2nd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 9)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 9))
        ),
      },
      {
        vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
        doseNumber: '1st Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 1.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 1.5))
        ),
      },
      {
        vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
        doseNumber: '2nd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 2.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 2.5))
        ),
      },
      {
        vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
        doseNumber: '3rd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 3.5)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
        ),
      },
      {
        vaccineType: 'Measles, Mumps, Rubella Vaccine (MMR)',
        doseNumber: '1st Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 9)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 9))
        ),
      },
      {
        vaccineType: 'Measles, Mumps, Rubella Vaccine (MMR)',
        doseNumber: '2nd Dose',
        dateOfVaccination: this.getNextWednesday(
          this.addMonths(birthDateObj, 12)
        ),
        rescheduleDate: this.addOneWeekToNextWednesday(
          this.getNextWednesday(this.addMonths(birthDateObj, 12))
        ),
      },
    ];

    return schedule;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  // Get the next Wednesday (as in the original logic)
  private getNextWednesday(date: Date): Date {
    const result = new Date(date);
    const dayOfWeek = result.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const daysUntilNextWednesday = (3 - dayOfWeek + 7) % 7; // 3 represents Wednesday
    result.setDate(result.getDate() + daysUntilNextWednesday);
    return result;
  }

  // Add one week to the next Wednesday for rescheduling
  private addOneWeekToNextWednesday(date: Date): Date {
    const nextWednesday = this.getNextWednesday(date);
    nextWednesday.setDate(nextWednesday.getDate() + 7); // Add 7 days (1 week)
    return nextWednesday;
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Child } from '../shared/models/child';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import {
  CHILD_URL,
  CHILD_VAX_SUMMARY_URL,
  CHILDREN_ANTHRO_PRINT,
  CHILDREN_PROFILE_URL,
} from '../shared/constants/urls';
import { AnthropometricStatus } from '../shared/models/anthropometric';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);

  // Function to get the token from local storage
  private getToken(): string {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    return user?.token || '';
  }

  getAll(filters?: any): Observable<Child[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    const params = new HttpParams({ fromObject: filters || {} });
    return this.http.get<Child[]>(CHILD_URL, { headers, params });
  }

  getVaccinationSummary(): Observable<any> {
    return this.http.get(CHILD_VAX_SUMMARY_URL);
  }

  getAllChildrenBySearchTerm(searchTerm: string): Observable<Child[]> {
    return this.getAll().pipe(
      map((children) =>
        children.filter((child) =>
          child.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  getChildrenById(id: string): Observable<Child> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<Child>(CHILDREN_PROFILE_URL + id, { headers });
  }

  updateChild(id: string, childData: Partial<Child>): Observable<Child> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http
      .patch<Child>(`${CHILD_URL}/${id}`, childData, { headers })
      .pipe(
        tap({
          next: (updatedChild) => {
            this.toastrService.success('Child updated successfully!', '', {
              timeOut: 2000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-bottom-right',
            });
          },
          error: (error) => {
            this.toastrService.error('Failed to update Child');
          },
        })
      );
  }

  deleteChild(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete(`${CHILD_URL}/${id}`, { headers });
  }
  // Original
  // getExpectedVaccinationSchedule(birthdate: string) {
  //   const birthDateObj = new Date(birthdate);
  //   const schedule = [
  //     {
  //       vaccineType: 'BCG',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: birthDateObj, // At birth
  //       rescheduleDate: this.addOneWeekToNextWednesday(birthDateObj),
  //     },
  //     {
  //       vaccineType: 'Hepatitis B Vaccine',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: birthDateObj, // At birth
  //       rescheduleDate: this.addOneWeekToNextWednesday(birthDateObj),
  //     },
  //     {
  //       vaccineType: 'Pentavalent Vaccine',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 1.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 1.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Pentavalent Vaccine',
  //       doseNumber: '2nd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 2.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 2.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Pentavalent Vaccine',
  //       doseNumber: '3rd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 3.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Oral Polio Vaccine (OPV)',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 1.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 1.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Oral Polio Vaccine (OPV)',
  //       doseNumber: '2nd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 2.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 2.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Oral Polio Vaccine (OPV)',
  //       doseNumber: '3rd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 3.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Inactivated Polio Vaccine (IPV)',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 3.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Inactivated Polio Vaccine (IPV)',
  //       doseNumber: '2nd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 9)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 9))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 1.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 1.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
  //       doseNumber: '2nd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 2.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 2.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Pneumococcal Conjugate Vaccine (PCV)',
  //       doseNumber: '3rd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 3.5)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 3.5))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Measles, Mumps, Rubella Vaccine (MMR)',
  //       doseNumber: '1st Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 9)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 9))
  //       ),
  //     },
  //     {
  //       vaccineType: 'Measles, Mumps, Rubella Vaccine (MMR)',
  //       doseNumber: '2nd Dose',
  //       dateOfVaccination: this.getNextWednesday(
  //         this.addMonths(birthDateObj, 12)
  //       ),
  //       rescheduleDate: this.addOneWeekToNextWednesday(
  //         this.getNextWednesday(this.addMonths(birthDateObj, 12))
  //       ),
  //     },
  //   ];

  //   return schedule;
  // }
  // Function to add days to a given date
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  getExpectedVaccinationSchedule(child: Child): any[] {
    const dateOfBirth = new Date(child.dateOfBirth);
    const vaccineSchedules = [
      {
        vaccineName: 'BCG',
        schedule: dateOfBirth,
        rescheduleDate: this.addDays(dateOfBirth, 7),
      }, // BCG at birth
      {
        vaccineName: 'Hepatitis B',
        schedule: dateOfBirth,
        rescheduleDate: this.addDays(dateOfBirth, 7),
      }, // Hepatitis B at birth

      // Pentavalent Vaccines
      {
        vaccineName: 'Pentavalent',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 45), // 1.5 months
        rescheduleDate: this.addDays(dateOfBirth, 45 + 7), // 1 week after scheduled date
      },
      {
        vaccineName: 'Pentavalent',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 75), // 2.5 months
        rescheduleDate: this.addDays(dateOfBirth, 75 + 7),
      },
      {
        vaccineName: 'Pentavalent',
        doseNumber: 3,
        schedule: this.addDays(dateOfBirth, 105), // 3.5 months
        rescheduleDate: this.addDays(dateOfBirth, 105 + 7),
      },

      // Oral Polio Vaccine (OPV)
      {
        vaccineName: 'OPV',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 45), // 1.5 months
        rescheduleDate: this.addDays(dateOfBirth, 45 + 7),
      },
      {
        vaccineName: 'OPV',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 75), // 2.5 months
        rescheduleDate: this.addDays(dateOfBirth, 75 + 7),
      },
      {
        vaccineName: 'OPV',
        doseNumber: 3,
        schedule: this.addDays(dateOfBirth, 105), // 3.5 months
        rescheduleDate: this.addDays(dateOfBirth, 105 + 7),
      },

      // Inactivated Polio Vaccine (IPV)
      {
        vaccineName: 'IPV',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 105), // IPV at 3.5 months
        rescheduleDate: this.addDays(dateOfBirth, 105 + 7),
      },
      {
        vaccineName: 'IPV',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 270), // IPV at 9 months
        rescheduleDate: this.addDays(dateOfBirth, 270 + 7),
      },

      // Pneumococcal Conjugate Vaccine (PCV)
      {
        vaccineName: 'PCV',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 45), // PCV at 1.5 months
        rescheduleDate: this.addDays(dateOfBirth, 45 + 7),
      },
      {
        vaccineName: 'PCV',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 75), // PCV at 2.5 months
        rescheduleDate: this.addDays(dateOfBirth, 75 + 7),
      },
      {
        vaccineName: 'PCV',
        doseNumber: 3,
        schedule: this.addDays(dateOfBirth, 105), // PCV at 3.5 months
        rescheduleDate: this.addDays(dateOfBirth, 105 + 7),
      },

      // Measles, Mumps, Rubella (MMR) Vaccine
      {
        vaccineName: 'MMR',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 270), // MMR at 9 months
        rescheduleDate: this.addDays(dateOfBirth, 270 + 7),
      },
      {
        vaccineName: 'MMR',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 365), // MMR at 12 months
        rescheduleDate: this.addDays(dateOfBirth, 365 + 7),
      },

      // MCV for Grade 1 and Grade 7
      {
        vaccineName: 'MCV',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 6 * 365), // MCV for Grade 1
        rescheduleDate: this.addDays(dateOfBirth, 6 * 365 + 7),
      },
      {
        vaccineName: 'MCV',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 12 * 365), // MCV for Grade 7
        rescheduleDate: this.addDays(dateOfBirth, 12 * 365 + 7),
      },

      // TD for Grade 1 and Grade 7
      {
        vaccineName: 'TD',
        doseNumber: 1,
        schedule: this.addDays(dateOfBirth, 6 * 365), // TD for Grade 1
        rescheduleDate: this.addDays(dateOfBirth, 6 * 365 + 7),
      },
      {
        vaccineName: 'TD',
        doseNumber: 2,
        schedule: this.addDays(dateOfBirth, 12 * 365), // TD for Grade 7
        rescheduleDate: this.addDays(dateOfBirth, 12 * 365 + 7),
      },
    ];

    // Additional Vaccines for Female Children (HPV)
    if (child.gender === 'Female') {
      const hpvVaccineSchedules = [
        {
          vaccineName: 'Human Papillomavirus Vaccine (HPV)',
          doseNumber: 1,
          schedule: this.addDays(dateOfBirth, 9 * 365), // HPV 1st Dose - Grade 4 (around 9 years)
          rescheduleDate: this.addDays(dateOfBirth, 9 * 365 + 7),
        },
        {
          vaccineName: 'Human Papillomavirus Vaccine (HPV)',
          doseNumber: 2,
          schedule: this.addDays(dateOfBirth, 10 * 365), // HPV 2nd Dose - 1 year later
          rescheduleDate: this.addDays(dateOfBirth, 10 * 365 + 7),
        },
      ];

      // Add the HPV schedules to the general vaccine schedule
      vaccineSchedules.push(...hpvVaccineSchedules);
    }
    return vaccineSchedules;
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

  // Get children Anthro
  getChildrenAnthro(): Observable<any> {
    return this.http.get(CHILDREN_ANTHRO_PRINT);
  }
}

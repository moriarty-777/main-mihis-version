import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Child } from '../shared/models/child';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import {
  CHILD_ADD_URL,
  CHILD_ALL_SCHEDULES_URL,
  CHILD_ANTHROPOMETRIC_URL,
  CHILD_NUTRITIONAL_STATUS_URL,
  CHILD_SCHEDULE_URL,
  CHILD_URL,
  CHILD_VACCINATION_URL,
  CHILD_VAX_SUMMARY_URL,
  CHILD_WEIGHING_HISTORY_URL,
  CHILDREN_ANTHRO_PRINT,
  CHILDREN_PROFILE_URL,
} from '../shared/constants/urls';
import { AnthropometricStatus } from '../shared/models/anthropometric';
import { Vaccination } from '../shared/models/vaccination';

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

  getAllSchedules(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(CHILD_ALL_SCHEDULES_URL, { headers });
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

  // private addMonths(date: Date, months: number): Date {
  //   const result = new Date(date);
  //   result.setMonth(result.getMonth() + months);
  //   return result;
  // }

  // Get the next Wednesday (as in the original logic)
  // private getNextWednesday(date: Date): Date {
  //   const result = new Date(date);
  //   const dayOfWeek = result.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
  //   const daysUntilNextWednesday = (3 - dayOfWeek + 7) % 7; // 3 represents Wednesday
  //   result.setDate(result.getDate() + daysUntilNextWednesday);
  //   return result;
  // }

  // Add one week to the next Wednesday for rescheduling
  // private addOneWeekToNextWednesday(date: Date): Date {
  //   const nextWednesday = this.getNextWednesday(date);
  //   nextWednesday.setDate(nextWednesday.getDate() + 7); // Add 7 days (1 week)
  //   return nextWednesday;
  // }

  // Get children Anthro
  getChildrenAnthro(): Observable<any> {
    return this.http.get(CHILDREN_ANTHRO_PRINT);
  }

  // Add Vaccination
  addVaccination(
    childId: string,
    vaccinationData: any
  ): Observable<Vaccination> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .post<Vaccination>(
        `${CHILD_VACCINATION_URL}${childId}/vaccination`,
        vaccinationData,
        { headers }
      )
      .pipe(
        tap({
          next: (newVaccination) => {
            this.toastrService.success('Vaccination added successfully!', '', {
              timeOut: 2000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-bottom-right',
            });
            setTimeout(() => {
              window.location.reload(); // Refresh the page to show new vaccination
            }, 2000);
          },
          error: (error) => {
            this.toastrService.error('Failed to add vaccination');
          },
        })
      );
  }

  // Retrieve and update vaccination
  // In ChildService
  getVaccinationById(
    childId: string,
    vaccinationId: string
  ): Observable<Vaccination> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http.get<Vaccination>(
      `${CHILD_VACCINATION_URL}${childId}/vaccination/${vaccinationId}`,
      { headers }
    );
  }

  updateVaccination(
    childId: string,
    vaccinationId: string,
    updatedData: any
  ): Observable<Vaccination> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .patch<Vaccination>(
        `${CHILD_VACCINATION_URL}${childId}/vaccination/${vaccinationId}`,
        updatedData,
        { headers }
      )
      .pipe(
        tap({
          next: (updatedVaccination) => {
            this.toastrService.success(
              'Vaccination updated successfully!',
              '',
              {
                timeOut: 2000,
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-bottom-right',
              }
            );
            setTimeout(() => {
              window.location.reload(); // Refresh the page to show updated vaccination
            }, 2000);
          },
          error: (error) => {
            this.toastrService.error('Failed to update vaccination');
          },
        })
      );
  }

  // AEFI
  // Add AEFI
  addAEFI(vaccinationId: string, aefiData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post(
      `${CHILD_VACCINATION_URL}${vaccinationId}/aefi`,
      aefiData,
      { headers }
    );
  }

  // Nutri Calc

  // TODO:
  // Get weighing history for a child
  // getWeighingHistory(childId: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http.get<any>(CHILD_WEIGHING_HISTORY_URL(childId), { headers });
  // }

  // // Add a new weighing entry for a child
  // addWeighingEntry(childId: string, weighingData: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http
  //     .post<any>(CHILD_WEIGHING_HISTORY_URL(childId), weighingData, { headers })
  //     .pipe(
  //       tap({
  //         next: () =>
  //           this.toastrService.success('Weighing entry added successfully!'),
  //         error: () => this.toastrService.error('Failed to add weighing entry'),
  //       })
  //     );
  // }

  // // Get nutritional status for a child
  // getNutritionalStatus(childId: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http.get<any>(CHILD_NUTRITIONAL_STATUS_URL(childId), {
  //     headers,
  //   });
  // }

  // // Update nutritional status for a child
  // updateNutritionalStatus(
  //   childId: string,
  //   nutritionalData: any
  // ): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http
  //     .patch<any>(CHILD_NUTRITIONAL_STATUS_URL(childId), nutritionalData, {
  //       headers,
  //     })
  //     .pipe(
  //       tap({
  //         next: () =>
  //           this.toastrService.success(
  //             'Nutritional status updated successfully!'
  //           ),
  //         error: () =>
  //           this.toastrService.error('Failed to update nutritional status'),
  //       })
  //     );
  // }

  // Get anthropometric data for a child
  // getAnthropometricData(childId: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http.get<any>(CHILD_ANTHROPOMETRIC_URL(childId), { headers });
  // }

  // Update anthropometric data for a child
  // updateAnthropometricData(
  //   childId: string,
  //   anthropometricData: any
  // ): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http
  //     .patch<any>(CHILD_ANTHROPOMETRIC_URL(childId), anthropometricData, {
  //       headers,
  //     })
  //     .pipe(
  //       tap({
  //         next: () =>
  //           this.toastrService.success(
  //             'Anthropometric data updated successfully!'
  //           ),
  //         error: () =>
  //           this.toastrService.error('Failed to update anthropometric data'),
  //       })
  //     );
  // }

  // 3 Things weighing
  // addWeighingHistory(childId: string, weighingData: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });

  //   return this.http
  //     .post(
  //       `${CHILD_WEIGHING_HISTORY_URL}/${childId}/weighing-history`,
  //       weighingData,
  //       { headers }
  //     )
  //     .pipe(
  //       tap({
  //         next: (response) => {
  //           this.toastrService.success(
  //             'Weighing history added successfully!',
  //             '',
  //             {
  //               timeOut: 2000,
  //               closeButton: true,
  //               progressBar: true,
  //               positionClass: 'toast-bottom-right',
  //             }
  //           );
  //         },
  //         error: (error) => {
  //           this.toastrService.error('Failed to add weighing history');
  //         },
  //       })
  //     );
  // }
  // addNutritionalStatus(childId: string, nutritionalData: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });

  //   return this.http
  //     .post(
  //       `${CHILD_NUTRITIONAL_STATUS_URL}/${childId}/nutritional-status`,
  //       nutritionalData,
  //       { headers }
  //     )
  //     .pipe(
  //       tap({
  //         next: (response) => {
  //           this.toastrService.success(
  //             'Nutritional status added successfully!',
  //             '',
  //             {
  //               timeOut: 2000,
  //               closeButton: true,
  //               progressBar: true,
  //               positionClass: 'toast-bottom-right',
  //             }
  //           );
  //         },
  //         error: (error) => {
  //           this.toastrService.error('Failed to add nutritional status');
  //         },
  //       })
  //     );
  // }

  addAnthropometricAssessment(
    childId: string,
    anthropometricData: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .post(
        `${CHILD_ANTHROPOMETRIC_URL}${childId}/anthropometric`,
        anthropometricData,
        { headers }
      )
      .pipe(
        tap({
          next: (response) => {
            this.toastrService.success(
              'Anthropometric assessment added successfully!',
              '',
              {
                timeOut: 2000,
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-bottom-right',
              }
            );
          },
          error: (error) => {
            this.toastrService.error('Failed to add anthropometric assessment');
          },
        })
      );
  }

  addWeighingHistory(childId: string, weighingData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .post(
        `${CHILD_WEIGHING_HISTORY_URL}${childId}/weighing-history`,
        weighingData,
        { headers }
      )
      .pipe(
        tap({
          next: (response) => {
            this.toastrService.success(
              'Weighing history added successfully!',
              '',
              {
                timeOut: 2000,
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-bottom-right',
              }
            );
          },
          error: (error) => {
            this.toastrService.error('Failed to add weighing history');
          },
        })
      );
  }

  addNutritionalStatus(
    childId: string,
    nutritionalStatusData: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .post(
        `${CHILD_NUTRITIONAL_STATUS_URL}${childId}/nutritional-status`,
        nutritionalStatusData,
        { headers }
      )
      .pipe(
        tap({
          next: (response) => {
            this.toastrService.success(
              'Nutritional status added successfully!',
              '',
              {
                timeOut: 2000,
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-bottom-right',
              }
            );
          },
          error: (error) => {
            this.toastrService.error('Failed to add nutritional status');
          },
        })
      );
  }

  // UPDATE NUT ANTHRO WEIGHING
  updateWeighingHistory(
    childId: string,
    weighingId: string,
    weighingData: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .patch(
        `${CHILD_WEIGHING_HISTORY_URL}${childId}/weighing-history/${weighingId}`,
        weighingData,
        { headers }
      )
      .pipe(
        tap({
          next: () =>
            this.toastrService.success(
              'Weighing history updated successfully!'
            ),
          error: () =>
            this.toastrService.error('Failed to update weighing history'),
        })
      );
  }

  updateAnthropometric(
    childId: string,
    anthropometricId: string,
    anthropometricData: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .patch(
        `${CHILD_ANTHROPOMETRIC_URL}${childId}/anthropometric/${anthropometricId}`,
        anthropometricData,
        { headers }
      )
      .pipe(
        tap({
          next: () =>
            this.toastrService.success(
              'Anthropometric data updated successfully!'
            ),
          error: () =>
            this.toastrService.error('Failed to update anthropometric data'),
        })
      );
  }
  //
  updateNutritionalStatus(
    childId: string,
    nutritionalStatusId: string,
    nutritionalStatusData: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .patch(
        `${CHILD_NUTRITIONAL_STATUS_URL}${childId}/nutritional-status/${nutritionalStatusId}`,
        nutritionalStatusData,
        { headers }
      )
      .pipe(
        tap({
          next: () =>
            this.toastrService.success(
              'Nutritional status updated successfully!'
            ),
          error: () =>
            this.toastrService.error('Failed to update nutritional status'),
        })
      );
  }

  // Update Scheduling
  updateScheduleStatus(scheduleId: string, updateData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.patch(
      `${CHILD_SCHEDULE_URL}/${scheduleId}/status`,
      updateData,
      {
        headers,
      }
    );
  }
}

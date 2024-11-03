import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  REPORT_MISSED_VACCINES_URL,
  REPORT_VACCINE_DOSES_URL,
} from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class AnalyticReportsService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);

  // Function to get the token from local storage
  private getToken(): string {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    return user?.token || '';
  }

  getMissedVaccineReport(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any[]>(REPORT_MISSED_VACCINES_URL, { headers });
  }

  getVaccineDoseCounts(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    // return this.http.get<any[]>(REPORT_VACCINE_DOSES_URL, { headers });
    return this.http
      .get<any[]>(REPORT_VACCINE_DOSES_URL, { headers })
      .pipe(tap((data) => console.log('Fetched vaccine dose counts:', data)));
  }
}

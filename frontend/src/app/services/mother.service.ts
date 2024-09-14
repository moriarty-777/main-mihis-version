import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mother } from '../shared/models/mother';
import { ToastrService } from 'ngx-toastr';
import { MOTHER_URL, MOTHER_PROFILE_URL } from '../shared/constants/urls';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MotherService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);

  private getToken(): string {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    return user?.token || '';
  }

  getAll(filters?: any): Observable<Mother[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    const params = new HttpParams({ fromObject: filters || {} });
    return this.http.get<Mother[]>(MOTHER_URL, { headers, params });
  }

  getAllMotherBySearchTerm(searchTerm: string): Observable<Mother[]> {
    return this.getAll().pipe(
      map((mothers) =>
        mothers.filter((mother) =>
          mother.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  getMotherById(id: string): Observable<Mother> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<Mother>(MOTHER_PROFILE_URL + id, { headers });
  }

  updateMother(id: string, motherdData: Partial<Mother>): Observable<Mother> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http
      .patch<Mother>(`${MOTHER_URL}/${id}`, motherdData, { headers })
      .pipe(
        map((updatedMother) => {
          this.toastrService.success('Mother updated successfully!', '', {
            timeOut: 2000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-right',
          });
          return updatedMother;
        })
      );
  }

  deleteMother(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete(`${MOTHER_URL}/${id}`, { headers });
  }
}

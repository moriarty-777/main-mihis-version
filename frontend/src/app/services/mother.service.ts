import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mother } from '../shared/models/mother';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import {
  MOTHER_URL,
  MOTHER_PROFILE_URL,
  GET_CHILDREN_BY_MOTHER_ID,
  CHILD_ADD_URL,
} from '../shared/constants/urls';
import { Child } from '../shared/models/child';

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

  // Fetch the children for the given mother ID
  // getChildrenByMotherId(motherId: string) {
  //   return this.http.get(GET_CHILDREN_BY_MOTHER_ID(motherId));
  // }

  getMotherById(id: string): Observable<Mother> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<Mother>(MOTHER_PROFILE_URL + id, { headers });
  }

  addChild(child: Child): Observable<Child> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`, // Adjust the token if necessary
    });

    return this.http.post<Child>(CHILD_ADD_URL, child, { headers }).pipe(
      tap({
        next: (newChild) => {
          this.toastrService.success('Child added successfully!', '', {
            timeOut: 2000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-right',
          });
          setTimeout(() => {
            window.location.reload(); // Refreshes the entire page
          }, 2000); // Wait for 2 seconds to allow the toast to display
        },
        error: (error) => {
          this.toastrService.error('Failed to add Child');
        },
      })
    );
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

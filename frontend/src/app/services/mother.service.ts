import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Mother } from '../shared/models/mother';
import { MOTHER_PROFILE_URL, MOTHER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MotherService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);
  constructor() {}

  getAll(): Observable<Mother[]> {
    return this.http.get<Mother[]>(MOTHER_URL);
  }

  getAllMotherBySearchTerm(searchTerm: string) {
    return this.getAll().pipe(
      map((mothers) =>
        mothers.filter((mother) =>
          mother.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  getMotherById(id: string): Observable<Mother> {
    return this.http.get<Mother>(MOTHER_PROFILE_URL + id);
  }

  // Update
  updateMother(id: string, motherdData: Partial<Mother>): Observable<Mother> {
    return this.http.patch<Mother>(`${MOTHER_URL}/${id}`, motherdData).pipe(
      tap({
        next: (updatedMother) => {
          this.toastrService.success('Mother updated successfully!', '', {
            timeOut: 2000, // 2000 milliseconds = 2 seconds
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-right',
          });
        },
        error: (error) => {
          this.toastrService.error('Failed to update Mother');
        },
      })
    );
  }

  // Delete
  deleteMother(id: string): Observable<any> {
    return this.http.delete(`${MOTHER_URL}/${id}`);
  }
}

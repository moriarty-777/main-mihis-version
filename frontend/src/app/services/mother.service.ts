import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Mother } from '../shared/models/mother';
import { MOTHER_PROFILE_URL, MOTHER_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class MotherService {
  private http = inject(HttpClient);
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
}

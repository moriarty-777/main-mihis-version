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
}

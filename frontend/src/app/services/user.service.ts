import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/models/user';
import { ToastrService } from 'ngx-toastr';
import {
  USER_LOGIN_URL,
  USER_SIGNUP_URL,
  USER_URL,
  AUDIT_LOGS_URL,
  USER_PROFILE_URL,
  USER_LOGOUT_URL,
  USER_EXPORT_URL,
  USER_ACTIVATE_DEACTIVATE,
} from '../shared/constants/urls';
import { tap, map } from 'rxjs/operators';
import { IUserLogin } from '../shared/models/iuserLogin';
import { IUserSignUp } from '../shared/models/iuserSignup';
import { Router } from '@angular/router';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  public userObservable: Observable<User>;

  constructor() {
    this.userObservable = this.userSubject.asObservable();
  }

  private getToken(): string {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    return user?.token || '';
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  getAll(): Observable<User[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<User[]>(USER_URL, { headers });
  }

  getLogs(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any[]>(AUDIT_LOGS_URL, { headers });
  }

  getAllUserBySearchTerm(searchTerm: string): Observable<User[]> {
    return this.getAll().pipe(
      map((users) =>
        users
          .filter((user) => user.role && user.role.toLowerCase() !== 'admin')
          .filter((user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
  }

  getUserById(id: string): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<User>(USER_PROFILE_URL + id, { headers });
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to MIHIS ${user.firstName + ' ' + user.lastName}!`,
            'Login Successful'
          );
        },
        error: (HttpErrorResponse) => {
          this.toastrService.error(HttpErrorResponse.error, 'Login Failed');
        },
      })
    );
  }

  signup(userRegister: IUserSignUp): Observable<User> {
    return this.http.post<User>(USER_SIGNUP_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);

          if (!user.role || user.role === 'pending') {
            // Display a message that the user needs to wait for admin approval
            this.toastrService.info(
              'You are a new user. Please wait for an admin to assign a role.',
              'Role Pending'
            );
          } else {
            this.toastrService.success(
              `Welcome to MIHIS ${user.firstName}`,
              'Signup Successful!'
            );
          }
        },
        error: (HttpErrorResponse) => {
          this.toastrService.error(HttpErrorResponse.error, 'Signup Failed');
        },
      })
    );
  }

  // Excel user
  // exportUsers(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`, // Add Authorization token
  //   });

  //   return this.http.get(USER_EXPORT_URL, { headers }); // Pass headers to the HTTP request
  // }

  // logout() {
  //   this.userSubject.next(new User());
  //   localStorage.removeItem(USER_KEY);
  //   window.location.reload();
  // }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    // Make a request to log the logout action and return the observable
    return this.http.post<any>(`${USER_LOGOUT_URL}`, {}, { headers }).pipe(
      tap({
        next: () => {
          this.clearUser(); // Clear user info after a successful logout
        },
        error: (error) => {
          console.error('Failed to log out:', error);
          this.clearUser(); // Proceed with logout even if the log fails
        },
      })
    );
  }

  clearUser() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
    this.router.navigate(['/']);
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }
  // Activate deactivate
  toggleUserActivation(userId: string): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.patch<User>(
      `${USER_ACTIVATE_DEACTIVATE}${userId}/toggle-activation`, // Add a '/' before userId
      {},
      { headers }
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http
      .patch<User>(`${USER_URL}/${id}`, userData, { headers })
      .pipe(
        tap({
          next: (updatedUser) => {
            this.toastrService.success('User updated successfully!', '', {
              timeOut: 2000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-bottom-right',
            });
          },
          error: (error) => {
            this.toastrService.error('Failed to update user');
          },
        })
      );
  }

  deleteUser(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete(`${USER_URL}/${userId}`, { headers });
  }
}

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/user';
import { IUserLogin } from '../shared/models/iuserLogin';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  USER_LOGIN_URL,
  USER_PROFILE_URL,
  USER_SIGNUP_URL,
  USER_URL,
} from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserSignUp } from '../shared/models/iuserSignup';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  public userObservable: Observable<User>;
  constructor() {
    this.userObservable = this.userSubject.asObservable(); //Read only version to eposed outside the user service
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(USER_URL);
  }

  // getAllMotherBySearchTerm(searchTerm: string) {
  //   return this.getAll().pipe(
  //     map((mothers) =>
  //       mothers.filter((mother) =>
  //         mother.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     )
  //   );
  // }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(USER_PROFILE_URL + id);
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
          // if (user.token) {
          //   this.setUserToLocalStorage(user);
          //   this.userSubject.next(user);
          //   this.toastrService.success(
          //     `Welcome ${user.firstName + ' ' + user.lastName}!`,
          //     'Login Successful'
          //   );
          // } else {
          //   // Handle the case where the token is not set
          //   this.toastrService.error('Token not received', 'Login Failed');
          // }
        },
        error: (HttpErrorResponse) => {
          this.toastrService.error(HttpErrorResponse.error, 'Login Failed');
        },
      })
    );
  } //

  // register signup
  signup(userRegister: IUserSignUp): Observable<User> {
    return this.http.post<User>(USER_SIGNUP_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the MIHIS ${user.firstName}`,
            'Signup Successfule!'
          );
        },
        error: (HttpErrorResponse) => {
          this.toastrService.error(HttpErrorResponse.error, 'Signup Failed');
        },
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // if (user.token) {
    //   localStorage.setItem(USER_KEY, JSON.stringify(user));
    // }
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }
}

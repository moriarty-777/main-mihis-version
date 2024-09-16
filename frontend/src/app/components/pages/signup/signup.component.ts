import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UsernameValidators } from '../../../shared/validators/username.validators';
import { PasswordValidators } from '../../../shared/validators/password.validators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IUserSignUp } from '../../../shared/models/iuserSignup';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  buttonLabel: string = 'Continue';
  returnUrl = '';
  isSubmitted = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private ActivatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private toastrService = inject(ToastrService);

  constructor() {}

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get username() {
    return this.signUpForm.get('username');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  confirmPasswordValid: boolean = false;
  passwordMismatchError: boolean = false;

  ngOnInit(): void {
    // form
    this.signUpForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        username: [
          '',
          [Validators.required, UsernameValidators.isEmailOrPhone],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: PasswordValidators.passwordShouldMatch,
      }
    );

    this.returnUrl = this.ActivatedRoute.snapshot.queryParams['returnUrl'];
    // form
    // Subscribe to form value changes
    this.signUpForm.valueChanges
      .pipe(
        // Delay the validation check by 700 milliseconds
        debounceTime(700),
        // Only proceed if the value has actually changed
        distinctUntilChanged()
      )
      .subscribe(() => {
        const usernameValue = this.username?.value;

        if (usernameValue) {
          if (UsernameValidators.isValidEmail(this.username) === null) {
            this.buttonLabel = 'Verify Email';
          } else if (UsernameValidators.isValidPhone(this.username) === null) {
            this.buttonLabel = 'Verify Phone';
          } else {
            this.buttonLabel = 'Continue';
          }
        } else {
          this.buttonLabel = 'Continue';
        }
        // Update the boolean flags based on the form's current validity state
        this.confirmPasswordValid = this.confirmPassword?.valid || false;
        this.passwordMismatchError =
          this.signUpForm.errors?.['passwordShouldMatch'] || false;
      });
  }

  // submitSignUpApplication() {
  //   this.UserService.signup(
  //     this.signUpForm.value.firstName ?? '',
  //     this.signUpForm.value.lastName ?? '',
  //     this.signUpForm.value.emailOrPhone ?? '',
  //     this.signUpForm.value.password ?? ''
  //   );
  // }

  submit() {
    this.isSubmitted = true;
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched(); // Mark all controls as touched
      return;
    }

    const formValue = this.signUpForm.value;
    const user: IUserSignUp = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      username: formValue.username,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
    };

    this.userService.signup(user).subscribe((_) => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
  // submit() {
  //   this.isSubmitted = true;

  //   if (this.signUpForm.invalid) {
  //     this.signUpForm.markAllAsTouched();
  //     return;
  //   }

  //   const formValue = this.signUpForm.value;
  //   const user: IUserSignUp = {
  //     firstName: formValue.firstName,
  //     lastName: formValue.lastName,
  //     username: formValue.username,
  //     password: formValue.password,
  //     confirmPassword: formValue.confirmPassword,
  //   };

  //   this.userService.signup(user).subscribe({
  //     next: (user) => {
  //       if (!user.role || user.role === 'pending') {
  //         // Notify the user and log them out or navigate to a waiting page
  //         this.toastrService.info(
  //           'Please wait for an admin to assign a role.',
  //           'Role Pending'
  //         );

  //         // Clear user data and navigate them to a "waiting" page or logout
  //         this.userService.logout(); // Log them out
  //         this.router.navigateByUrl('/role-pending'); // Optionally redirect to a page explaining the situation
  //       } else {
  //         this.router.navigateByUrl(this.returnUrl);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Signup failed:', error);
  //       this.toastrService.error('Signup failed. Please try again.');
  //     },
  //   });
  // }
}

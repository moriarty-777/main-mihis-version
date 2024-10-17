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
import { SmsService } from '../../../services/sms.service';

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

  // OTP
  otpSent = false;
  otpVerified = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private smsService = inject(SmsService);
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

  get otp() {
    return this.signUpForm.get('otp');
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
        otp: ['', Validators.required],
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
  } // end ng on init

  sendOTP() {
    const username = this.signUpForm.value.username;

    // Check if the username is an email or phone number
    if (this.isEmail(username)) {
      this.smsService.sendOTP(username).subscribe({
        next: (response) => {
          this.otpSent = true;
          this.toastrService.success('OTP sent to email successfully!');
          this.signUpForm.get('otp')?.enable(); // Enable OTP input after OTP is sent
        },
        error: (err) => {
          this.toastrService.error(
            'Failed to send OTP via email. Please try again.'
          );
        },
      });
    } else if (this.isPhoneNumber(username)) {
      this.smsService.sendOTP(username).subscribe({
        next: (response) => {
          this.otpSent = true;
          this.toastrService.success('OTP sent to phone number successfully!');
          this.signUpForm.get('otp')?.enable(); // Enable OTP input after OTP is sent
        },
        error: (err) => {
          this.toastrService.error(
            'Failed to send OTP via SMS. Please try again.'
          );
        },
      });
    } else {
      this.toastrService.error('Please enter a valid email or phone number.');
    }
  }

  isEmail(username: string): boolean {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username);
  }

  isPhoneNumber(username: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(username); // E.164 format for phone numbers
  }

  // Method to verify OTP
  verifyOTP() {
    const username = this.signUpForm.value.username;
    const otp = this.signUpForm.value.otp;

    this.smsService.verifyOTP(username, otp).subscribe({
      next: (response) => {
        this.otpVerified = true;
        this.toastrService.success('OTP verified successfully!');
      },
      error: (err) => {
        this.toastrService.error('Invalid OTP. Please try again.');
      },
    });
  }

  submit() {
    this.isSubmitted = true;

    // Enable the OTP field if it's disabled
    if (this.signUpForm.get('otp')?.disabled) {
      this.signUpForm.get('otp')?.enable();
    }

    // Mark all controls as touched
    this.signUpForm.markAllAsTouched();

    // Check if the form is invalid or OTP has not been verified
    if (this.signUpForm.invalid || !this.otpVerified) {
      if (!this.otpVerified) {
        this.toastrService.error('Please verify OTP before proceeding.');
      }
      return;
    }

    // this.signUpForm.markAllAsTouched(); // Mark all controls as touched
    // if (this.signUpForm.invalid || !this.otpVerified) {
    //   if (!this.otpVerified) {
    //     this.toastrService.error('Please verify OTP before proceeding.');
    //   }
    //   return;
    // }

    const formValue = this.signUpForm.value;
    const user: IUserSignUp = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      username: formValue.username,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
    };

    this.userService.signup(user).subscribe({
      next: (user) => {
        if (!user.role || user.role === 'pending') {
          // Notify the user and log them out or navigate to a waiting page
          this.toastrService.info(
            'Please wait for an admin to assign a role.',
            'Role Pending',
            {
              timeOut: 3000, // Notification will disappear after 3 seconds
              closeButton: true, // Optional: Add a close button if needed
              progressBar: true, // Optional: Show a progress bar
            }
          );

          // Wait for 3 seconds before logging the user out and redirecting
          setTimeout(() => {
            this.userService.logout(); // Log them out
            this.router.navigate(['/']); // Redirect to homepage after logout
          }, 3000); // 3-second delay
        } else {
          // this.router.navigateByUrl(this.returnUrl);
          this.userService.logout().subscribe(() => {
            this.router.navigate(['/']); // Redirect to homepage after successful signup
          });
        }
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.toastrService.error('Signup failed. Please try again.');
      },
    });
  }
}

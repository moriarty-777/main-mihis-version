import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsernameValidators } from '../../../shared/validators/username.validators';
import { PasswordValidators } from '../../../shared/validators/password.validators';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  loginForm: FormGroup;
  buttonLabel: string = 'Login';
  isSubmitted = false;

  returnUrl = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          UsernameValidators.isEmailOrPhone,
          UsernameValidators.cannotContainSpace,
        ],
      ],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mark all controls as touched
      return;
    }

    this.userService
      .login({ username: this.username?.value, password: this.password?.value })
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }
}

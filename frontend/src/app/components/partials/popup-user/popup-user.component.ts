import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UsernameValidators } from '../../../shared/validators/username.validators';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-popup-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-user.component.html',
  styleUrl: './popup-user.component.css',
})
export class PopupUserComponent {
  updateForm!: FormGroup;
  isSubmitted = false;
  private dialogRef = inject(MatDialogRef);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string }) {}

  ngOnInit(): void {
    this.userService.getUserById(this.data.userId).subscribe((user: User) => {
      // Initialize the form with fetched user data
      const formattedDate = this.formatDate(user.dateOfService);
      this.updateForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        dateOfService: formattedDate || '',
        photoPath: user.photoPath || 'assets/img/default-user-profile.jpg',
        gender: user.gender || '',
      });
      console.log(formattedDate);
    });

    this.updateForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        username: [
          '',
          [Validators.required, UsernameValidators.isEmailOrPhone],
        ],
        dateOfService: ['', [Validators.required]],
        photoPath: ['', [Validators.required]],
        gender: ['', [Validators.required]],

        // password: ['', [Validators.required, Validators.minLength(6)]],
        // confirmPassword: ['', Validators.required],
      }
      // {
      //   validators: PasswordValidators.passwordShouldMatch,
      // }
    );
  }
  // Helper function to format the date to 'YYYY-MM-DD'
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure two digits
    const day = ('0' + d.getDate()).slice(-2); // Ensure two digits
    return `${year}-${month}-${day}`;
  }

  get firstName() {
    return this.updateForm.get('firstName');
  }

  get lastName() {
    return this.updateForm.get('lastName');
  }

  get username() {
    return this.updateForm.get('username');
  }

  get dateOfService() {
    return this.updateForm.get('dateOfService');
  }

  get photoPath() {
    return this.updateForm.get('photoPath');
  }

  get gender() {
    return this.updateForm.get('gender');
  }

  update() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const updatedUser = this.updateForm.value;

    // Send updated user data to backend
    this.userService
      .updateUser(this.data.userId, updatedUser)
      .subscribe((response) => {
        this.dialogRef.close();
        // console.log('User updated successfully!', response);
        // Handle success logic, such as closing the dialog or showing a message
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2000 milliseconds = 2 seconds
      });
  }
}

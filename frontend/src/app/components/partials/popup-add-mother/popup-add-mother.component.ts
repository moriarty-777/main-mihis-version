import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MotherService } from '../../../services/mother.service';
import { ToastrService } from 'ngx-toastr';
import { UsernameValidators } from '../../../shared/validators/username.validators';

@Component({
  selector: 'app-popup-add-mother',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-add-mother.component.html',
  styleUrl: './popup-add-mother.component.css',
})
export class PopupAddMotherComponent {
  addMotherForm!: FormGroup;
  private dialogRef = inject(MatDialogRef);
  // private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private motherService = inject(MotherService);
  private toastrService = inject(ToastrService);

  constructor() {
    this.addMotherForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['Female', [Validators.required]],
      phone: ['', [Validators.required, UsernameValidators.isValidPhone]], // Phone validator
      email: ['', [UsernameValidators.isValidEmail]], // Email validator
      barangay: ['Bangad', [Validators.required]],
      purok: ['', [Validators.required]],
      photoPath: ['assets/img/default-user-profile.jpg', [Validators.required]], // default image
      isTransient: ['', [Validators.required]],
    });
  }
  get firstName() {
    return this.addMotherForm.get('firstName');
  }

  get lastName() {
    return this.addMotherForm.get('lastName');
  }

  get gender() {
    return this.addMotherForm.get('gender');
  }

  get phone() {
    return this.addMotherForm.get('phone');
  }

  get email() {
    return this.addMotherForm.get('email');
  }

  get barangay() {
    return this.addMotherForm.get('barangay');
  }

  get purok() {
    return this.addMotherForm.get('purok');
  }

  get photoPath() {
    return this.addMotherForm.get('photoPath');
  }

  get isTransient() {
    return this.addMotherForm.get('isTransient');
  }

  addMother() {
    console.log('Form Data:', this.addMotherForm.value);
    if (this.addMotherForm.invalid) {
      this.addMotherForm.markAllAsTouched(); // Mark all controls as touched
      return; // Exit if the form is invalid
    }

    if (this.addMotherForm.valid) {
      const newMother = this.addMotherForm.value;
      this.motherService.addMother(newMother).subscribe(
        (response: any) => {
          // this.toastrService.success('Mother added successfully!');
          this.dialogRef.close(response);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error: any) => {
          this.toastrService.error('Failed to add mother');
        }
      );
    }
  }
}

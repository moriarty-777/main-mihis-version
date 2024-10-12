import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from '../../../services/child.service';
import { MotherService } from '../../../services/mother.service';
import { Mother } from '../../../shared/models/mother';

@Component({
  selector: 'app-popup-mother',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-mother.component.html',
  styleUrl: './popup-mother.component.css',
})
export class PopupMotherComponent {
  // private cd = inject(ChangeDetectorRef);
  updatesForm!: FormGroup;
  isSubmitted = false;
  private dialogRef = inject(MatDialogRef);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private motherService = inject(MotherService);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { motherId: string }) {}

  ngOnInit(): void {
    setTimeout(() => {
      // Check if the motherId exists before fetching data
      if (this.data && this.data.motherId) {
        this.motherService.getMotherById(this.data.motherId).subscribe(
          (mother: Mother) => {
            this.updatesForm.patchValue({
              firstName: mother.firstName || '',
              lastName: mother.lastName || '',
              phone: mother.phone || '',
              email: mother.email || '',
              barangay: mother.barangay || '',
              isTransient: mother.isTransient ? 'true' : 'false',
              purok: mother.purok || '',
              photoPath:
                mother.photoPath || 'assets/img/default-user-profile.jpg',
              gender: mother.gender || '',
            });
          },
          (error) => {
            console.error('Error fetching Mother data:', error);
          }
        );
      } else {
        console.error('MotherId is missing in MAT_DIALOG_DATA');
      }
    }, 1); // this

    // Initialize the form
    this.updatesForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', [Validators.required]],
      photoPath: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: [''],
      barangay: ['', [Validators.required]],
      isTransient: ['', [Validators.required]],
      purok: ['', [Validators.required]],
    });
  }

  get firstName() {
    return this.updatesForm.get('firstName');
  }

  get lastName() {
    return this.updatesForm.get('lastName');
  }

  get photoPath() {
    return this.updatesForm.get('photoPath');
  }

  get gender() {
    return this.updatesForm.get('gender');
  }

  get phone() {
    return this.updatesForm.get('phone');
  }

  get email() {
    return this.updatesForm.get('email');
  }

  get barangay() {
    return this.updatesForm.get('barangay');
  }

  get isTransient() {
    return this.updatesForm.get('isTransient');
  }
  get purok() {
    return this.updatesForm.get('purok');
  }

  update() {
    if (this.updatesForm.invalid) {
      this.updatesForm.markAllAsTouched();
      return;
    }

    const updatedMother = this.updatesForm.value;

    // Send updated user data to backend
    this.motherService
      .updateMother(this.data.motherId, updatedMother)
      .subscribe((response) => {
        this.dialogRef.close();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }
}

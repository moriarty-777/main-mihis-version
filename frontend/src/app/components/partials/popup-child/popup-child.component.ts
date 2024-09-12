import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from '../../../services/child.service';
import { CommonModule } from '@angular/common';
import { Child } from '../../../shared/models/child';

@Component({
  selector: 'app-popup-child',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-child.component.html',
  styleUrl: './popup-child.component.css',
})
export class PopupChildComponent {
  private cd = inject(ChangeDetectorRef);
  updatesForm!: FormGroup;
  isSubmitted = false;
  private dialogRef = inject(MatDialogRef);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private childService = inject(ChildService);
  h: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { childId: string }) {
    this.h = this.data.childId;
    console.log('Received childId in constructor:', this.data.childId);
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure two digits
    const day = ('0' + d.getDate()).slice(-2); // Ensure two digits
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    // Check if the childId exists before fetching data
    if (this.data && this.data.childId) {
      this.childService.getChildrenById(this.data.childId).subscribe(
        (response: any) => {
          const child = response.child; // Access the nested 'child' object from the response
          if (child) {
            const formattedDate = this.formatDate(child.dateOfBirth);
            console.log('Child first name:', child.firstName);

            // Initialize the form with fetched child data
            this.updatesForm.patchValue({
              firstName: child.firstName || '',
              lastName: child.lastName || '',
              dateOfBirth: formattedDate || '',
              photoPath: child.photoPath || 'assets/img/child-default.jpg',
              gender: child.gender || '',
            });
          } else {
            console.error('Child data is missing in the response');
          }
        },
        (error) => {
          console.error('Error fetching child data:', error);
        }
      );
    } else {
      console.error('childId is missing in MAT_DIALOG_DATA');
    }

    // Initialize the form
    this.updatesForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      photoPath: ['', [Validators.required]],
    });
  }

  // ngAfterViewInit(): void {
  //   // Call detectChanges in ngAfterViewInit
  //   this.cd.detectChanges();
  //   console.log('Change detection forced in ngAfterViewInit');
  // }

  get firstName() {
    return this.updatesForm.get('firstName');
  }

  get lastName() {
    return this.updatesForm.get('lastName');
  }

  get dateOfBirth() {
    return this.updatesForm.get('dateOfBirth');
  }

  get photoPath() {
    return this.updatesForm.get('photoPath');
  }

  get gender() {
    return this.updatesForm.get('gender');
  }

  update() {
    if (this.updatesForm.invalid) {
      this.updatesForm.markAllAsTouched();
      return;
    }

    const updatedChild = this.updatesForm.value;

    // Send updated user data to backend
    this.childService
      .updateChild(this.data.childId, updatedChild)
      .subscribe((response) => {
        this.dialogRef.close();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }
} // end

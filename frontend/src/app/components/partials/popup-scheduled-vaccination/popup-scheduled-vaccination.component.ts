import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChildService } from '../../../services/child.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-scheduled-vaccination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-scheduled-vaccination.component.html',
  styleUrl: './popup-scheduled-vaccination.component.css',
})
export class PopupScheduledVaccinationComponent {
  scheduledVaccinationForm: FormGroup;
  private defaultMidwifeId = '66dfe2205309a42e3710c6af';
  userId!: string; // To store the current user's ID
  userRole!: string; // To store the user's role

  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    public dialogRef: MatDialogRef<PopupScheduledVaccinationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      childId: string;
      vaccineType: string;
      doseNumber: string;
      dateOfVaccination: string;
      placeOfVaccination: string;
    }
  ) {
    this.scheduledVaccinationForm = this.fb.group({
      vaccineType: [{ value: this.data.vaccineType, disabled: true }],
      doseNumber: [{ value: this.data.doseNumber, disabled: true }],
      placeOfVaccination: [
        { value: this.data.placeOfVaccination, disabled: true },
      ],
      dateOfVaccination: [this.getTodayDate(), Validators.required],
    });
    this.loadUserFromLocalStorage(); // Load user ID and role for recordedBy field
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const day = ('0' + today.getDate()).slice(-2); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  }
  /*       dateOfVaccination: [this.getTodayDate(), [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUserFromLocalStorage();
  }

  // Function to return today's date in 'yyyy-MM-dd' format
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const day = ('0' + today.getDate()).slice(-2); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  } */

  loadUserFromLocalStorage() {
    const user = localStorage.getItem('User'); // Fetch the user from local storage
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id; // Store user ID
      this.userRole = parsedUser.role; // Store user role (e.g., admin, midwife, bhw)
    }
  }
  confirmVaccination() {
    console.log('Confirm Vaccination button clicked'); // Debugging line
    const vaccinationData = {
      ...this.scheduledVaccinationForm.getRawValue(),
      midwifeId: this.defaultMidwifeId,
      bhwId: this.userId,
    };

    console.log('Confirm Vaccination data:', vaccinationData); // Debugging line
    this.childService
      .addVaccination(this.data.childId, vaccinationData)
      .subscribe(() => {
        this.dialogRef.close(true); // Close the dialog on success
      });
  }

  // confirmVaccination() {
  //   // Call the service to confirm vaccination on schedule
  //   this.childService
  //     .addVaccination(this.data.childId, {
  //       vaccineType: this.data.vaccineType,
  //       doseNumber: this.data.doseNumber,
  //       placeOfVaccination: this.data.placeOfVaccination,
  //       dateOfVaccination: this.data.dateOfVaccination,
  //     })
  //     .subscribe(() => {
  //       this.dialogRef.close(true); // Close and return success
  //     });
  // }
}

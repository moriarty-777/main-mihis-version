import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChildService } from '../../../services/child.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-add-vaccination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-add-vaccination.component.html',
  styleUrl: './popup-add-vaccination.component.css',
})
export class PopupAddVaccinationComponent {
  addVaccinationForm: FormGroup;
  private defaultMidwifeId = '66dfe2205309a42e3710c6af';
  userId!: string; // To store the current user's ID
  userRole!: string; // To store the user's role

  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    public dialogRef: MatDialogRef<PopupAddVaccinationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { childId: string }
  ) {
    this.addVaccinationForm = this.fb.group({
      vaccineType: ['', [Validators.required]],
      doseNumber: ['', [Validators.required]],
      placeOfVaccination: ['Bangad Health Center', [Validators.required]],
      dateOfVaccination: [this.getTodayDate(), [Validators.required]],
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
  }

  // Function to load user data from local storage
  loadUserFromLocalStorage() {
    const user = localStorage.getItem('User'); // Fetch the user from local storage
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id; // Store user ID
      this.userRole = parsedUser.role; // Store user role (e.g., admin, midwife, bhw)
    }
  }

  addVaccination() {
    if (this.addVaccinationForm.valid) {
      const vaccinationData = this.addVaccinationForm.value;
      console.log('Vaccination Data being sent:', vaccinationData); // Log the data being sent

      vaccinationData.midwifeId = this.defaultMidwifeId;
      vaccinationData.bhwId = this.userId;

      this.childService
        .addVaccination(this.data.childId, vaccinationData)
        .subscribe(() => {
          this.dialogRef.close(); // Close the dialog after successful addition
        });
    }
  }
}

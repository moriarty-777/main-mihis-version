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
  selector: 'app-popup-update-vaccination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-update-vaccination.component.html',
  styleUrl: './popup-update-vaccination.component.css',
})
export class PopupUpdateVaccinationComponent {
  updateVaccinationForm: FormGroup;
  userId!: string; // To store the current user's ID

  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    public dialogRef: MatDialogRef<PopupUpdateVaccinationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { childId: string; vaccinationId: string }
  ) {
    this.updateVaccinationForm = this.fb.group({
      vaccineType: ['', [Validators.required]],
      doseNumber: ['', [Validators.required]],
      placeOfVaccination: ['', [Validators.required]],
      dateOfVaccination: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    setTimeout(() => {
      this.loadVaccinationData();
    }, 1);
  }

  // Load current user data
  loadUserFromLocalStorage() {
    const user = localStorage.getItem('User');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
    }
  }

  // Load the existing vaccination data to prepopulate the form
  // loadVaccinationData() {
  //   this.childService
  //     .getVaccinationById(this.data.childId, this.data.vaccinationId)
  //     .subscribe((vaccination: any) => {
  //       this.updateVaccinationForm.patchValue({
  //         vaccineType: vaccination.vaccineType,
  //         doseNumber: vaccination.doseNumber,
  //         placeOfVaccination: vaccination.placeOfVaccination,
  //         dateOfVaccination: vaccination.dateOfVaccination,
  //       });
  //     });
  // }

  loadVaccinationData() {
    this.childService
      .getVaccinationById(this.data.childId, this.data.vaccinationId)
      .subscribe((vaccination: any) => {
        // Format the date for Angular date input
        const formattedDate = this.formatDateForInput(
          vaccination.dateOfVaccination
        );

        this.updateVaccinationForm.patchValue({
          vaccineType: vaccination.vaccineType,
          doseNumber: vaccination.doseNumber,
          placeOfVaccination: vaccination.placeOfVaccination,
          dateOfVaccination: formattedDate,
        });
      });
  }

  // Helper function to format the date as yyyy-MM-dd
  formatDateForInput(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Update the vaccination record
  updateVaccination() {
    if (this.updateVaccinationForm.valid) {
      const updatedData = {
        ...this.updateVaccinationForm.value,
        recordedBy: this.userId, // Set 'recordedBy' based on current user
      };

      this.childService
        .updateVaccination(
          this.data.childId,
          this.data.vaccinationId,
          updatedData
        )
        .subscribe(() => {
          this.dialogRef.close(); // Close the dialog after successful update
        });
    }
  }
}

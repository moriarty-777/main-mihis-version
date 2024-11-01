import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChildService } from '../../../services/child.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupAddAefiComponent } from '../popup-add-aefi/popup-add-aefi.component';

@Component({
  selector: 'app-popup-missed-vaccination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-missed-vaccination.component.html',
  styleUrl: './popup-missed-vaccination.component.css',
})
export class PopupMissedVaccinationComponent {
  addMissedVaccineForm: FormGroup;
  private toastrService = inject(ToastrService);

  isOtherSelected = false;

  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    public dialogRef: MatDialogRef<PopupAddAefiComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      childId: string;
      vaccineType: string;
      dateOfVaccination: string;
    }
  ) {
    const dateMissed = data.dateOfVaccination
      ? this.addOneDay(data.dateOfVaccination)
      : this.getTodayDate();

    this.addMissedVaccineForm = this.fb.group({
      vaccineName: [{ value: this.data.vaccineType, disabled: true }],
      reason: ['', [Validators.required]],
      otherReason: [''],
      dateMissed: [dateMissed, [Validators.required]],
    });
  }
  // childId: schedule.number,
  //         vaccineType: schedule.vaccineName,
  //         dateOfVaccination: schedule.rescheduleDate,
  //         placeOfVaccination: schedule.location,
  // Function to add one day to a given date in 'yyyy-MM-dd' format
  addOneDay(dateStr: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Return in 'yyyy-MM-dd' format
  }
  get vaccineName() {
    return this.addMissedVaccineForm.get('vaccineName');
  }

  get reason() {
    return this.addMissedVaccineForm.get('reason');
  }

  get otherReason() {
    return this.addMissedVaccineForm.get('otherReason');
  }

  get dateMissed() {
    return this.addMissedVaccineForm.get('dateMissed');
  }

  // Method to handle reason selection change
  onReasonChange(event: any) {
    const selectedReason = event.target.value;
    this.isOtherSelected = selectedReason === 'Other';

    if (this.isOtherSelected) {
      this.addMissedVaccineForm.controls['otherReason'].setValidators(
        Validators.required
      );
    } else {
      this.addMissedVaccineForm.controls['otherReason'].clearValidators();
    }
    this.addMissedVaccineForm.controls['otherReason'].updateValueAndValidity();
  }

  // Function to return today's date in 'yyyy-MM-dd' format
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const day = ('0' + today.getDate()).slice(-2); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  }

  addMissedVaccine() {
    if (this.addMissedVaccineForm.invalid) {
      this.addMissedVaccineForm.markAllAsTouched();
      return;
    }
    const missedVaccineData = {
      vaccineName: this.data.vaccineType,
      dateMissed: this.addMissedVaccineForm.value.dateMissed,
      reason:
        this.addMissedVaccineForm.value.reason === 'Other'
          ? this.addMissedVaccineForm.value.otherReason
          : this.addMissedVaccineForm.value.reason,
    };
    this.childService
      .addMissedVaccine(this.data.childId, missedVaccineData)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.toastrService.success(
            'Missed vaccine recorded successfully!',
            '',
            {
              timeOut: 2000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-bottom-right',
            }
          );
        },
        error: () => {
          this.toastrService.error('Failed to record missed vaccine');
        },
      });
  }
}

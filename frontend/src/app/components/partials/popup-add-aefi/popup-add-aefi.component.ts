import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChildService } from '../../../services/child.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupAddVaccinationComponent } from '../popup-add-vaccination/popup-add-vaccination.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-popup-add-aefi',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-add-aefi.component.html',
  styleUrl: './popup-add-aefi.component.css',
})
export class PopupAddAefiComponent {
  addAefiForm: FormGroup;
  private toastrService = inject(ToastrService);
  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    public dialogRef: MatDialogRef<PopupAddAefiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vaccinationId: string }
  ) {
    this.addAefiForm = this.fb.group({
      description: ['', [Validators.required]],
      severity: ['', [Validators.required]],
      dateOfEvent: [this.getTodayDate(), [Validators.required]],
    });
  }

  get description() {
    return this.addAefiForm.get('description');
  }

  get severity() {
    return this.addAefiForm.get('severity');
  }

  get dateOfEvent() {
    return this.addAefiForm.get('dateOfEvent');
  }

  // Function to return today's date in 'yyyy-MM-dd' format
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const day = ('0' + today.getDate()).slice(-2); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  }

  addAefi() {
    if (this.addAefiForm.invalid) {
      this.addAefiForm.markAllAsTouched();
      return;
    }
    if (this.addAefiForm.valid) {
      const AEFIData = this.addAefiForm.value;
      this.childService.addAEFI(this.data.vaccinationId, AEFIData).subscribe(
        (response: any) => {
          this.dialogRef.close(response);
          this.toastrService.success('AEFI added successfully!', '', {
            timeOut: 2000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-right',
          }),
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

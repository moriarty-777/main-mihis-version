import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Child } from '../../../shared/models/child';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vaccine-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vaccine-popup.component.html',
  styleUrl: './vaccine-popup.component.css',
})
export class VaccinePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public child: Child) {}
  getVaccineDates(child: Child, vaccineType: string): string {
    return child.vaccinations
      .filter((vaccine) => vaccine.vaccineType === vaccineType)
      .map((vaccine) =>
        new Date(vaccine.dateOfVaccination).toLocaleDateString()
      )
      .join(', ');
  }
}

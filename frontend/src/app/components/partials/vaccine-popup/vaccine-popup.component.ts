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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { child: Child; motherName: string }
  ) {}

  // Access child data
  get child(): Child {
    return this.data.child;
  }

  // Access motherName
  get motherName(): string {
    return this.data.motherName;
  }

  vaccineTypeMapping = {
    BCG: 'BCG',
    'Hepatitis B Vaccine': 'Hepatitis B',
    'Pentavalent Vaccine': 'Pentavalent',
    'Oral Polio Vaccine (OPV)': 'OPV',
    'Inactivated Polio Vaccine (IPV)': 'IPV',
    'Pneumococcal Conjugate Vaccine (PCV)': 'PCV',
    'Measles, Mumps, Rubella Vaccine (MMR)': 'MMR',
    'MCV (Grade 1)': 'MCV Grade 1',
    'MCV (Grade 7)': 'MCV Grade 7',
    'TD (Grade 1)': 'TD Grade 1',
    'TD (Grade 7)': 'TD Grade 7',
    'HPV (Dose 1)': 'Human Papillomavirus Vaccine (HPV)',
  };

  getVaccineDates(child: Child, vaccineType: string): string {
    return child.vaccinations
      .filter((vaccine) => vaccine.vaccineType === vaccineType)
      .map((vaccine) =>
        new Date(vaccine.dateOfVaccination).toLocaleDateString()
      )
      .join(', ');
  }
}

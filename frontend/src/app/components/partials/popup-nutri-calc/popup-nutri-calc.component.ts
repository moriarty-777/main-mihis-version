import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NutritionalStatusCalcComponent } from '../../pages/nutritional-status-calc/nutritional-status-calc.component';

@Component({
  selector: 'app-popup-nutri-calc',
  standalone: true,
  imports: [NutritionalStatusCalcComponent],
  template: `
    <nutritional-status-calc
      [ageInMonths]="data.ageInMonths"
      [weight]="data.weight"
      [height]="data.height"
      [gender]="data.gender"
    ></nutritional-status-calc>
  `,
  // templateUrl: './popup-nutri-calc.component.html',
  styleUrl: './popup-nutri-calc.component.css',
})
export class PopupNutriCalcComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupNutriCalcComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ageInMonths: number;
      weight: number;
      height: number;
      gender: 'Male' | 'Female';
    }
  ) {}
}

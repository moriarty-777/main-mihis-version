import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChildService } from '../../../services/child.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-update-nutri-calc',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './popup-update-nutri-calc.component.html',
  styleUrl: './popup-update-nutri-calc.component.css',
})
export class PopupUpdateNutriCalcComponent {
  // ageInMonths: number = 0;
  // weight: number = 0;
  // height: number = 0;
  // gender: 'male' | 'female' | '' = '';
  // classification: string = '';
  // TODO:
  private childrenService = inject(ChildService);
  private dialog = inject(MatDialog);
  @Input() ageInMonths: number = 0;
  @Input() childId: any;
  @Input() anthropometricId: string;
  @Input() weighingId: string;
  @Input() nutritionalStatusId: string;
  @Input() weight: number = 0;
  @Input() height: number = 0;
  @Input() gender: 'Male' | 'Female' | '' = '';
  classification: string = '';
  nutStatus: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      childId: string;
      anthropometricId: string;
      weighingId: string;
      nutritionalStatusId: string;
      weight: number;
      ageInMonths: number;
      height: number;
      gender: 'Male' | 'Female' | '';
    },
    private dialogRef: MatDialogRef<PopupUpdateNutriCalcComponent>
  ) {
    this.childId = data.childId;
    this.anthropometricId = data.anthropometricId;
    this.weighingId = data.weighingId;
    this.nutritionalStatusId = data.nutritionalStatusId;
    this.weight = data.weight;
    this.height = data.height;
    this.gender = data.gender;
    this.ageInMonths = data.ageInMonths;
  }
  ngOnInit() {
    console.log('Data received:', this.data); // Log the received data for debugging
    this.ageInMonths = this.data.ageInMonths || this.ageInMonths;
    this.weight = this.data.weight || this.weight;
    this.height = this.data.height || this.height;
    this.gender = this.data.gender || this.gender;

    console.log('Initialized Values:', {
      ageInMonths: this.ageInMonths,
      weight: this.weight,
      height: this.height,
      gender: this.gender,
    });

    // Only calculate if the values are set
    if (this.ageInMonths && this.weight && this.height && this.gender) {
      this.calculateNutritionalStatus();
    }
    // this.checkAndCalculate();
    if (this.ageInMonths && this.weight && this.height && this.gender) {
      this.calculateNutritionalStatus(); // Calculate if data is pre-filled
    }
  }

  // checkAndCalculate() {
  //   if (this.ageInMonths && this.weight && this.height && this.gender) {
  //     this.calculateNutritionalStatus();
  //   }
  // }

  // TODO:
  // Weight for Length Z-score thresholds
  private weightForLengthThresholds: any = {
    Female: {
      '0-24': {
        '-3SD': [
          1.9, 2.0, 2.0, 2.1, 2.2, 2.2, 2.3, 2.4, 2.4, 2.5, 2.6, 2.7, 2.8, 2.8,
          2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2,
          4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.5,
          5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.1, 6.2, 6.3, 6.4, 6.5, 6.5, 6.6, 6.7,
          6.8, 6.9, 7.0, 7.0, 7.1, 7.1, 7.2, 7.3, 7.4, 7.4, 7.5, 7.6, 7.7, 7.7,
          7.8, 7.9, 8.0, 8.1, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0,
          9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.1, 10.2,
          10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.3,
          11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.3, 12.4, 12.5,
          12.6, 12.7, 12.8, 13.0, 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, 13.9,
          14.0,
        ],
        '-2SD': [
          2.1, 2.1, 2.2, 2.3, 2.4, 2.4, 2.5, 2.6, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1,
          3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.3, 4.4, 4.5, 4.6,
          4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0,
          6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.9, 7.0, 7.1, 7.2, 7.3,
          7.4, 7.4, 7.5, 7.6, 7.7, 7.8, 7.8, 7.9, 8.0, 8.1, 8.2, 8.2, 8.3, 8.4,
          8.5, 8.6, 8.7, 8.8, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 9.8,
          9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0,
          11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 12.0, 12.1, 12.2,
          12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 13.0, 13.1, 13.2, 13.3, 13.5,
          13.6, 13.7, 13.8, 14.0, 14.1, 14.3, 14.4, 14.5, 14.7, 14.8, 15.0,
          15.1, 15.3,
        ],
        Median: [
          2.5, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7,
          3.8, 3.9, 4.0, 4.2, 4.3, 4.4, 4.5, 4.7, 4.8, 5.0, 5.1, 5.2, 5.4, 5.5,
          5.6, 5.7, 5.9, 6.0, 6.1, 6.3, 6.4, 6.5, 6.6, 6.7, 6.9, 7.0, 7.1, 7.2,
          7.3, 7.4, 7.5, 7.6, 7.7, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7,
          8.8, 8.9, 9.0, 9.1, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0,
          10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.9, 11.0, 11.1, 11.2,
          11.3, 11.5, 11.6, 11.7, 11.8, 12.0, 12.1, 12.2, 12.3, 12.5, 12.6,
          12.7, 12.8, 13.0, 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, 13.8, 14.0,
          14.1, 14.2, 14.4, 14.5, 14.6, 14.8, 14.9, 15.0, 15.2, 15.3, 15.5,
          15.6, 15.8, 15.9, 16.1, 16.2, 16.4, 16.5, 16.7, 16.9, 17.1, 17.2,
          17.4, 17.6, 17.8, 18.0, 18.1, 18.3,
        ],
        '+2SD': [
          3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.2, 4.3, 4.4,
          4.6, 4.7, 4.9, 5.0, 5.2, 5.3, 5.5, 5.7, 5.8, 6.0, 6.1, 6.3, 6.5, 6.6,
          6.8, 6.9, 7.1, 7.3, 7.4, 7.6, 7.7, 7.8, 8.0, 8.1, 8.3, 8.4, 8.6, 8.7,
          8.8, 9.0, 9.1, 9.2, 9.4, 9.5, 9.6, 9.7, 9.9, 10.0, 10.1, 10.2, 10.3,
          10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.4, 11.5, 11.6,
          11.7, 11.8, 11.9, 12.0, 12.1, 12.3, 12.4, 12.5, 12.6, 12.8, 12.9,
          13.1, 13.2, 13.3, 13.5, 13.6, 13.8, 13.9, 14.1, 14.2, 14.4, 14.5,
          14.7, 14.8, 15.0, 15.1, 15.3, 15.5, 15.6, 15.8, 15.9, 16.1, 16.2,
          16.4, 16.5, 16.7, 16.8, 17.0, 17.1, 17.3, 17.5, 17.6, 17.8, 18.0,
          18.1, 18.3, 18.5, 18.7, 18.9, 19.0, 19.2, 19.4, 19.6, 19.8, 20.0,
          20.2, 20.5, 20.7, 20.9, 21.1, 21.3, 21.6, 21.8, 22.0, 22.3,
        ],
        '+3SD': [
          3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 4.9,
          5.1, 5.2, 5.4, 5.5, 5.7, 5.9, 6.1, 6.3, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3,
          7.5, 7.7, 7.8, 8.0, 8.2, 8.4, 8.5, 8.7, 8.8, 9.0, 9.1, 9.3, 9.5, 9.6,
          9.8, 9.9, 10.0, 10.2, 10.3, 10.5, 10.6, 10.7, 10.9, 11.0, 11.1, 11.3,
          11.4, 11.5, 11.7, 11.8, 11.9, 12.0, 12.2, 12.3, 12.4, 12.5, 12.6,
          12.8, 12.9, 13.0, 13.1, 13.3, 13.4, 13.5, 13.7, 13.8, 13.9, 14.1,
          14.2, 14.4, 14.5, 14.7, 14.9, 15.0, 15.2, 15.4, 15.5, 15.7, 15.9,
          16.0, 16.2, 16.4, 16.5, 16.7, 16.9, 17.0, 17.2, 17.4, 17.5, 17.7,
          17.9, 18.0, 18.2, 18.4, 18.6, 18.7, 18.9, 19.1, 19.3, 19.5, 19.6,
          19.8, 20.0, 20.2, 20.4, 20.6, 20.8, 21.0, 21.3, 21.5, 21.7, 21.9,
          22.2, 22.4, 22.6, 22.9, 23.1, 23.4, 23.6, 23.9, 24.2, 24.4, 24.7,
        ],
      },
      '24-60': {
        '-3SD': [
          5.6, 5.7, 5.8, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.3, 6.4, 6.5, 6.6, 6.7,
          6.7, 6.8, 6.9, 7.0, 7.0, 7.1, 7.2, 7.2, 7.3, 7.4, 7.5, 7.5, 7.6, 7.7,
          7.8, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.5, 8.6, 8.7, 8.8, 8.9,
          9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2,
          10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.8, 10.9, 11.0, 11.1, 11.2,
          11.3, 11.4, 11.5, 11.6, 11.7, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4,
          12.5, 12.6, 12.8, 12.9, 13.0, 13.1, 13.3, 13.4, 13.5, 13.7, 13.8,
          13.9, 14.1, 14.2, 14.4, 14.5, 14.7, 14.8, 15.0, 15.1, 15.3, 15.4,
          15.6, 15.7, 15.9, 16.0, 16.2, 16.3, 16.5, 16.6, 16.8, 16.9, 17.1,
          17.3,
        ],
        '-2SD': [
          6.1, 6.2, 6.3, 6.4, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.1, 7.2,
          7.3, 7.4, 7.5, 7.6, 7.6, 7.7, 7.8, 7.9, 8.0, 8.0, 8.1, 8.2, 8.3, 8.4,
          8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7,
          9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.9, 11.0,
          11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1,
          12.2, 12.3, 12.4, 12.5, 12.7, 12.8, 12.9, 13.0, 13.1, 13.3, 13.4,
          13.5, 13.6, 13.8, 13.9, 14.0, 14.2, 14.3, 14.5, 14.6, 14.7, 14.9,
          15.0, 15.2, 15.4, 15.5, 15.7, 15.8, 16.0, 16.2, 16.3, 16.5, 16.7,
          16.8, 17.0, 17.2, 17.3, 17.5, 17.7, 17.8, 18.0, 18.2, 18.4, 18.5,
          18.7, 18.9,
        ],
        Median: [
          7.2, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6,
          8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.6, 9.7, 9.8, 9.9,
          10.0, 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1,
          11.3, 11.4, 11.5, 11.6, 11.8, 11.9, 12.0, 12.1, 12.3, 12.4, 12.5,
          12.6, 12.8, 12.9, 13.0, 13.1, 13.3, 13.4, 13.5, 13.6, 13.8, 13.9,
          14.0, 14.1, 14.3, 14.4, 14.5, 14.7, 14.8, 14.9, 15.1, 15.2, 15.4,
          15.5, 15.7, 15.8, 16.0, 16.1, 16.3, 16.4, 16.6, 16.8, 16.9, 17.1,
          17.3, 17.5, 17.7, 17.8, 18.0, 18.2, 18.4, 18.6, 18.8, 19.0, 19.2,
          19.4, 19.6, 19.8, 20.0, 20.2, 20.5, 20.7, 20.9, 21.1, 21.3, 21.5,
          21.7, 22.0, 22.2, 22.4, 22.6, 22.8,
        ],
        '+2SD': [
          8.7, 8.9, 9.0, 9.1, 9.3, 9.4, 9.5, 9.7, 9.8, 9.9, 10.0, 10.1, 10.3,
          10.4, 10.5, 10.6, 10.7, 10.8, 11.0, 11.1, 11.2, 11.3, 11.4, 11.5,
          11.6, 11.7, 11.8, 12.0, 12.1, 12.2, 12.3, 12.4, 12.6, 12.7, 12.8,
          13.0, 13.1, 13.3, 13.4, 13.5, 13.7, 13.8, 14.0, 14.2, 14.3, 14.5,
          14.6, 14.8, 14.9, 15.1, 15.2, 15.4, 15.5, 15.7, 15.8, 16.0, 16.1,
          16.3, 16.4, 16.6, 16.7, 16.9, 17.0, 17.2, 17.4, 17.5, 17.7, 17.9,
          18.0, 18.2, 18.4, 18.6, 18.7, 18.9, 19.1, 19.3, 19.5, 19.7, 19.9,
          20.1, 20.3, 20.5, 20.8, 21.0, 21.2, 21.4, 21.7, 21.9, 22.1, 22.4,
          22.6, 22.9, 23.1, 23.4, 23.6, 23.9, 24.2, 24.4, 24.7, 25.0, 25.2,
          25.5, 25.8, 26.1, 26.3, 26.6, 26.9, 27.2, 27.4, 27.7, 28.0,
        ],
        '+3SD': [
          9.7, 9.8, 10.0, 10.1, 10.2, 10.4, 10.5, 10.7, 10.8, 10.9, 11.1, 11.2,
          11.3, 11.5, 11.6, 11.7, 11.8, 12.0, 12.1, 12.2, 12.3, 12.5, 12.6,
          12.7, 12.8, 12.9, 13.1, 13.2, 13.3, 13.4, 13.6, 13.7, 13.9, 14.0,
          14.1, 14.3, 14.5, 14.6, 14.8, 14.9, 15.1, 15.3, 15.4, 15.6, 15.8,
          15.9, 16.1, 16.3, 16.4, 16.8, 16.8, 16.9, 17.1, 17.3, 17.4, 17.6,
          17.8, 17.9, 18.1, 18.3, 18.5, 18.6, 18.8, 19.0, 19.2, 19.3, 19.5,
          19.7, 19.9, 20.1, 20.3, 20.5, 20.7, 20.9, 21.1, 21.4, 21.6, 21.8,
          22.0, 22.3, 22.5, 22.7, 23.0, 23.2, 23.5, 23.7, 24.0, 24.3, 24.5,
          24.8, 25.1, 25.4, 25.7, 26.0, 26.2, 26.5, 26.8, 27.1, 27.4, 27.8,
          28.1, 28.4, 28.7, 29.0, 29.3, 29.6, 29.9, 30.3, 30.6, 30.9, 31.2,
        ],
      },
    },
    Male: {
      '0-24': {
        '-3SD': [
          1.9, 1.9, 2.0, 2.1, 2.1, 2.2, 2.3, 2.3, 2.4, 2.5, 2.6, 2.7, 2.7, 2.8,
          2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.3, 4.4,
          4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8,
          5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1,
          7.2, 7.2, 7.3, 7.4, 7.5, 7.6, 7.6, 7.7, 7.8, 7.9, 7.9, 8.0, 8.1, 8.2,
          8.2, 8.3, 8.4, 8.5, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4,
          9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6,
          10.7, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6,
          11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7,
          12.8, 12.9, 13.0, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 14.0,
          14.1, 14.2,
        ],
        '-2SD': [
          2.0, 2.1, 2.2, 2.3, 2.3, 2.4, 2.5, 2.6, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1,
          3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7,
          4.8, 5.0, 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3,
          6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.6,
          7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.3, 8.4, 8.5, 8.6, 8.7, 8.7, 8.8,
          8.9, 9.0, 9.1, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0,
          10.1, 10.2, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2,
          11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3,
          12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.2, 13.3, 13.4, 13.5,
          13.6, 13.7, 13.9, 14.0, 14.1, 14.2, 14.4, 14.5, 14.6, 14.7, 14.9,
          15.0, 15.1, 15.3, 15.4,
        ],
        Median: [
          2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6,
          3.8, 3.9, 4.0, 4.1, 4.3, 4.4, 4.5, 4.7, 4.8, 5.0, 5.1, 5.3, 5.4, 5.6,
          5.7, 5.9, 6.0, 6.1, 6.3, 6.4, 6.5, 6.7, 6.8, 6.9, 7.0, 7.1, 7.3, 7.4,
          7.5, 7.6, 7.7, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0,
          9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3,
          10.4, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.2, 11.3, 11.4,
          11.5, 11.6, 11.7, 11.9, 12.0, 12.1, 12.2, 12.4, 12.5, 12.6, 12.7,
          12.8, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.7, 13.8, 13.9, 14.0,
          14.1, 14.3, 14.4, 14.5, 14.6, 14.8, 14.9, 15.0, 15.2, 15.3, 15.4,
          15.6, 15.7, 15.9, 16.0, 16.2, 16.3, 16.5, 16.6, 16.8, 16.9, 17.1,
          17.3, 17.4, 17.6, 17.8, 17.9, 18.1, 18.3,
        ],
        '+2SD': [
          3.0, 3.1, 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.4,
          4.5, 4.6, 4.8, 4.9, 5.1, 5.3, 5.4, 5.6, 5.8, 5.9, 6.1, 6.3, 6.4, 6.6,
          6.8, 7.0, 7.1, 7.3, 7.4, 7.6, 7.7, 7.9, 8.0, 8.2, 8.3, 8.5, 8.6, 8.7,
          8.9, 9.0, 9.2, 9.3, 9.4, 9.6, 9.7, 9.8, 10.0, 10.1, 10.2, 10.4, 10.5,
          10.6, 10.8, 10.9, 11.0, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.9,
          12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 13.0, 13.1,
          13.2, 13.3, 13.5, 13.6, 13.7, 13.9, 14.0, 14.2, 14.3, 14.5, 14.6,
          14.7, 14.9, 15.0, 15.1, 15.3, 15.4, 15.6, 15.7, 15.8, 16.0, 16.1,
          16.3, 16.4, 16.5, 16.7, 16.8, 17.0, 17.1, 17.3, 17.5, 17.6, 17.8,
          18.0, 18.1, 18.3, 18.5, 18.7, 18.8, 19.0, 19.2, 19.4, 19.6, 19.8,
          20.0, 20.2, 20.4, 20.6, 20.8, 21.0, 21.2, 21.4, 21.7, 21.9,
        ],
        '+3SD': [
          3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.2, 4.3, 4.4, 4.5, 4.7, 4.8,
          5.0, 5.1, 5.3, 5.4, 5.6, 5.8, 6.0, 6.1, 6.3, 6.5, 6.7, 6.9, 7.1, 7.2,
          7.4, 7.6, 7.8, 8.0, 8.1, 8.3, 8.5, 8.6, 8.8, 8.9, 9.1, 9.3, 9.4, 9.6,
          9.7, 9.9, 10.0, 10.2, 10.3, 10.5, 10.6, 10.8, 10.9, 11.1, 11.2, 11.3,
          11.5, 11.6, 11.8, 11.9, 12.1, 12.2, 12.3, 12.5, 12.6, 12.7, 12.8,
          13.0, 13.1, 13.2, 13.3, 13.4, 13.6, 13.7, 13.8, 13.9, 14.0, 14.2,
          14.3, 14.4, 14.6, 14.7, 14.9, 15.0, 15.2, 15.3, 15.5, 15.6, 15.8,
          15.9, 16.1, 16.2, 16.4, 16.5, 16.7, 16.8, 17.0, 17.1, 17.3, 17.4,
          17.6, 17.7, 17.9, 18.0, 18.2, 18.4, 18.5, 18.7, 18.9, 19.1, 19.2,
          19.4, 19.6, 19.8, 20.0, 20.2, 20.4, 20.6, 20.8, 21.0, 21.2, 21.5,
          21.7, 21.9, 22.1, 22.4, 22.6, 22.8, 23.1, 23.3, 23.6, 23.8, 24.1,
        ],
      },
      '24-60': {
        '-3SD': [
          5.9, 6.0, 6.1, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.9, 7.0,
          7.1, 7.2, 7.3, 7.4, 7.4, 7.5, 7.6, 7.7, 7.7, 7.8, 7.9, 8.0, 8.0, 8.1,
          8.2, 8.3, 8.3, 8.4, 8.5, 8.6, 8.7, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3,
          9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5,
          10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.1, 11.2, 11.3, 11.4, 11.5,
          11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6,
          12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.7, 13.8, 13.9,
          14.0, 14.1, 14.3, 14.4, 14.5, 14.6, 14.8, 14.9, 15.0, 15.2, 15.3,
          15.4, 15.6, 15.7, 15.8, 16.0, 16.1, 16.2, 16.4, 16.5, 16.7, 16.8,
          16.9, 17.1,
        ],
        '-2SD': [
          6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6,
          7.7, 7.8, 7.9, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.5, 8.6, 8.7, 8.8,
          8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.3, 9.4, 9.5, 9.6, 9.7, 9.9, 10.0,
          10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1,
          11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2,
          12.3, 12.4, 12.5, 12.6, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4,
          13.6, 13.7, 13.8, 13.9, 14.0, 14.2, 14.3, 14.4, 14.5, 14.7, 14.8,
          14.9, 15.1, 15.2, 15.3, 15.5, 15.6, 15.8, 15.9, 16.0, 16.2, 16.3,
          16.5, 16.6, 16.8, 16.9, 17.1, 17.2, 17.4, 17.5, 17.7, 17.9, 18.0,
          18.2, 18.3, 18.5, 18.6,
        ],
        Median: [
          7.4, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9,
          9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2,
          10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.3,
          11.4, 11.5, 11.7, 11.8, 11.9, 12.0, 12.2, 12.3, 12.4, 12.5, 12.6,
          12.8, 12.9, 13.0, 13.1, 13.2, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9,
          14.1, 14.2, 14.3, 14.4, 14.6, 14.7, 14.8, 14.9, 15.1, 15.2, 15.4,
          15.5, 15.6, 15.8, 15.9, 16.1, 16.2, 16.4, 16.5, 16.7, 16.8, 17.0,
          17.2, 17.3, 17.5, 17.7, 17.8, 18.0, 18.2, 18.3, 18.5, 18.7, 18.9,
          19.1, 19.2, 19.4, 19.6, 19.8, 20.0, 20.2, 20.4, 20.6, 20.8, 21.0,
          21.2, 21.4, 21.6, 21.8, 22.0, 22.2, 22.4,
        ],
        '+2SD': [
          8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.6, 9.8, 9.9, 10.0, 10.2, 10.3, 10.4,
          10.6, 10.7, 10.8, 11.0, 11.1, 11.2, 11.3, 11.4, 11.6, 11.7, 11.8,
          11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.6, 12.7, 12.8, 12.9, 13.0,
          13.1, 13.3, 13.4, 13.5, 13.7, 13.8, 13.9, 14.1, 14.2, 14.4, 14.5,
          14.7, 14.8, 14.9, 15.1, 15.2, 15.3, 15.5, 15.6, 15.8, 15.9, 16.0,
          16.2, 16.3, 16.5, 16.6, 16.7, 16.9, 17.0, 17.2, 17.4, 17.5, 17.7,
          17.9, 18.0, 18.2, 18.4, 18.5, 18.7, 18.9, 19.1, 19.3, 19.5, 19.7,
          19.9, 20.1, 20.3, 20.5, 20.7, 20.9, 21.1, 21.3, 21.5, 21.8, 22.0,
          22.2, 22.4, 22.7, 22.9, 23.1, 23.4, 23.6, 23.9, 24.1, 24.4, 24.6,
          24.9, 25.1, 25.4, 25.6, 25.9, 26.1, 26.4, 26.6, 26.9, 27.2,
        ],
        '+3SD': [
          9.6, 9.8, 9.9, 10.1, 10.2, 10.4, 10.5, 10.7, 10.8, 11.0, 11.1, 11.3,
          11.4, 11.6, 11.7, 11.8, 12.0, 12.1, 12.2, 12.4, 12.5, 12.6, 12.8,
          12.9, 13.0, 13.1, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 14.0, 14.1,
          14.2, 14.4, 14.5, 14.6, 14.8, 14.9, 15.1, 15.2, 15.4, 15.5, 15.7,
          15.8, 16.0, 16.1, 16.3, 16.4, 16.6, 16.7, 16.9, 17.0, 17.2, 17.3,
          17.5, 17.6, 17.8, 17.9, 18.1, 18.3, 18.4, 18.6, 18.8, 18.9, 19.1,
          19.3, 19.5, 19.7, 19.9, 20.1, 20.3, 20.5, 20.7, 20.9, 21.1, 21.3,
          21.6, 21.8, 22.0, 22.2, 22.5, 22.7, 22.9, 23.2, 23.4, 23.7, 23.9,
          24.2, 24.4, 24.7, 25.0, 25.2, 25.5, 25.8, 26.0, 26.3, 26.6, 26.9,
          27.2, 27.5, 27.8, 28.0, 28.3, 28.6, 28.9, 29.2, 29.5, 29.8, 30.1,
        ],
      },
    },
  };

  // Length for Age thresholds
  private lengthForAgeMedian: any = {
    Female: [
      49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8,
      74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.7, 85.7,
      86.6, 87.4, 88.3, 89.1, 89.9, 90.7, 91.5, 92.2, 92.9, 93.6, 94.3, 94.9,
      95.6, 96.2, 96.7, 97.3, 97.7, 98.2, 98.7, 99.1, 99.5, 99.9, 100.3, 100.6,
      101.0, 101.4, 101.7, 102.0, 102.4, 102.7, 103.0, 103.3, 103.6, 103.9,
    ],
    Male: [
      49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.6,
      75.8, 77.0, 78.1, 79.1, 80.1, 81.1, 82.1, 83.0, 84.0, 84.9, 85.8, 86.6,
      87.4, 88.3, 89.1, 89.9, 90.7, 91.5, 92.2, 92.9, 93.6, 94.3, 94.9, 95.6,
      96.2, 96.7, 97.3, 97.7, 98.2, 98.7, 99.1, 99.5, 99.9, 100.3, 100.6, 101.0,
      101.4, 101.7, 102.0, 102.4, 102.7, 103.0, 103.3, 103.6, 103.9, 104.2,
      104.5,
    ],
  };
  private lengthForAgeSD: any = {
    Female: [
      49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8,
      74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.7, 85.7,
      86.6, 87.4, 88.3, 89.1, 89.9, 90.7, 91.5, 92.2, 92.9, 93.6, 94.3, 94.9,
      95.6, 96.2, 96.7, 97.3, 97.7, 98.2, 98.7, 99.1, 99.5, 99.9, 100.3, 100.6,
      101.0, 101.4, 101.7, 102.0, 102.4, 102.7, 103.0, 103.3, 103.6, 103.9,
    ],
    Male: [
      2.5, 2.6, 2.7, 2.7, 2.8, 2.8, 2.8, 2.9, 2.9, 3.0, 3.0, 3.0, 3.1, 3.1, 3.1,
      3.2, 3.2, 3.2, 3.3, 3.3, 3.3, 3.4, 3.4, 3.4, 3.5, 3.5, 3.5, 3.6, 3.6, 3.6,
      3.7, 3.7, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 4.0, 4.0, 4.0, 4.1, 4.1, 4.1,
      4.2, 4.2, 4.2, 4.3, 4.3, 4.3, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5,
    ],
  };

  // Weight for Age thresholds
  private weightForAgeMedian: any = {
    Female: [
      3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 8.0, 8.3, 8.6, 8.9, 9.2, 9.4, 9.7,
      9.9, 10.1, 10.4, 10.6, 10.8, 11.1, 11.3, 11.5, 11.7, 11.9, 12.2, 12.4,
      12.6, 12.8, 13.0, 13.2, 13.4, 13.6, 13.8, 14.0, 14.2, 14.4, 14.6, 14.8,
      15.0, 15.2, 15.4, 15.6, 15.8, 16.0, 16.2, 16.4, 16.6, 16.8, 17.0, 17.2,
      17.4, 17.6, 17.8, 18.0, 18.2, 18.4, 18.6, 18.8, 19.0, 19.2,
    ],
    Male: [
      3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.5, 9.7, 10.0,
      10.3, 10.5, 10.8, 11.0, 11.3, 11.5, 11.8, 12.0, 12.3, 12.5, 12.8, 13.0,
      13.2, 13.5, 13.7, 13.9, 14.2, 14.4, 14.6, 14.8, 15.1, 15.3, 15.5, 15.7,
      15.9, 16.2, 16.4, 16.6, 16.8, 17.0, 17.3, 17.5, 17.7, 17.9, 18.1, 18.3,
      18.5, 18.7, 18.9, 19.1, 19.3, 19.5, 19.7, 19.9, 20.1,
    ],
  };
  private weightForAgeSD: any = {
    Female: [
      0.5, 0.6, 0.6, 0.7, 0.7, 0.8, 0.8, 0.8, 0.9, 0.9, 0.9, 1.0, 1.0, 1.0, 1.0,
      1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3, 1.3, 1.3, 1.3,
      1.4, 1.4, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6,
      1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.8,
    ],
    Male: [
      0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.3, 1.4, 1.4,
      1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9,
      1.9, 2.0, 2.0, 2.0, 2.0, 2.1, 2.1, 2.1, 2.1, 2.2, 2.2, 2.2, 2.2, 2.2, 2.3,
      2.3, 2.3, 2.3, 2.3, 2.4, 2.4, 2.4, 2.4, 2.4, 2.5, 2.5, 2.5, 2.5, 2.5,
    ],
  };

  private getInterpolatedThreshold(zScores: number[], length: number): number {
    const lengthIndex = Math.floor(length);
    const remainder = length - lengthIndex;

    if (lengthIndex < 0 || lengthIndex >= zScores.length - 1) {
      return zScores[lengthIndex]; // If out of bounds, return the closest index
    }

    const lowerValue = zScores[lengthIndex];
    const upperValue = zScores[lengthIndex + 1];
    console.log(zScores);
    // Interpolate between two closest values if there's a decimal remainder
    return lowerValue + remainder * (upperValue - lowerValue);
  }
  private getWeightForLengthStatus(
    gender: string,
    ageInMonths: number,
    weight: number,
    length: number
  ): string {
    const thresholds = this.weightForLengthThresholds[gender];
    let group: '0-24' | '24-60' = ageInMonths <= 24 ? '0-24' : '24-60';

    if (length < 45 || length > 120) {
      return 'Length out of range'; // Adjust according to the dataset range
    }

    const thresholdValues = {
      '-3SD': this.getInterpolatedThreshold(thresholds[group]['-3SD'], length),
      '-2SD': this.getInterpolatedThreshold(thresholds[group]['-2SD'], length),
      '+2SD': this.getInterpolatedThreshold(thresholds[group]['+2SD'], length),
      '+3SD': this.getInterpolatedThreshold(thresholds[group]['+3SD'], length),
    };
    console.log('Threshold values for length:', thresholdValues);
    if (weight < thresholdValues['-3SD']) {
      return 'Severely Wasted';
    } else if (
      weight >= thresholdValues['-3SD'] &&
      weight < thresholdValues['-2SD']
    ) {
      return 'Wasted';
    } else if (
      weight >= thresholdValues['-2SD'] &&
      weight <= thresholdValues['+2SD']
    ) {
      return 'Normal';
    } else if (
      weight > thresholdValues['+2SD'] &&
      weight <= thresholdValues['+3SD']
    ) {
      return 'Overweight';
    } else if (weight > thresholdValues['+3SD']) {
      return 'Obese';
    } else {
      return 'Invalid Data';
    }
  }

  private getLengthForAgeStatus(
    gender: string,
    ageInMonths: number,
    length: number
  ): string {
    const median = this.lengthForAgeMedian[gender][ageInMonths];
    const sd = this.lengthForAgeSD[gender][ageInMonths];
    const zScore = (length - median) / sd;

    if (zScore <= -3) {
      return 'Severely Stunted';
    } else if (zScore <= -2) {
      return 'Stunted';
    } else if (zScore >= 2) {
      return 'Tall';
    } else {
      return 'Normal';
    }
  }

  // Logic for Weight for Age
  private getWeightForAgeStatus(
    gender: string,
    ageInMonths: number,
    weight: number
  ): string {
    const median = this.weightForAgeMedian[gender][ageInMonths];
    const sd = this.weightForAgeSD[gender][ageInMonths];
    const zScore = (weight - median) / sd;
    if (zScore <= -3) {
      return 'Severely Underweight';
    } else if (zScore <= -2) {
      return 'Underweight';
    } else if (zScore >= 2) {
      return 'Overweight';
    } else {
      return 'Normal';
    }
  }

  calculateNutritionalStatus(): void {
    // Call each of the logic methods and assign the results to different variables
    if (!this.ageInMonths || !this.weight || !this.height || !this.gender) {
      console.error('All fields are required for calculation');
      return;
    }
    const weightForLengthStatus = this.getWeightForLengthStatus(
      this.gender,
      this.ageInMonths,
      this.weight,
      this.height
    );
    const lengthForAgeStatus = this.getLengthForAgeStatus(
      this.gender,
      this.ageInMonths,
      this.height
    );
    const weightForAgeStatus = this.getWeightForAgeStatus(
      this.gender,
      this.ageInMonths,
      this.weight
    );

    // Determine the overall nutritional status based on the individual statuses
    let overallStatus = 'Normal';
    if (lengthForAgeStatus === 'Tall') {
      overallStatus = 'Normal';
    } else if (
      weightForLengthStatus !== 'Normal' ||
      lengthForAgeStatus !== 'Normal' ||
      weightForAgeStatus !== 'Normal'
    ) {
      overallStatus = 'Malnourished';
    }
    this.classification = `${this.getOverallStatus(
      weightForLengthStatus,
      lengthForAgeStatus,
      weightForAgeStatus
    )},${weightForAgeStatus}, ${lengthForAgeStatus}, ${weightForLengthStatus}`;
    this.nutStatus = this.classification.split(',')[0];
  }

  getOverallStatus(
    weightForLengthStatus: string,
    lengthForAgeStatus: string,
    weightForAgeStatus: string
  ): string {
    return weightForLengthStatus === 'Normal' &&
      lengthForAgeStatus === 'Normal' &&
      weightForAgeStatus === 'Normal'
      ? 'Normal'
      : 'Malnourished';
  }

  updateData() {
    const anthropometricData = {
      ageInMonths: this.ageInMonths,
      weight: this.weight,
      height: this.height,
      gender: this.gender,
      overallStatus: this.nutStatus,
      weightForLengthStatus: this.classification.split(',')[3].trim(),
      lengthForAgeStatus: this.classification.split(',')[2].trim(),
      weightForAgeStatus: this.classification.split(',')[1].trim(),
    };

    const weighingData = {
      date: new Date(),
      weight: this.weight,
      height: this.height,
      childId: this.childId,
      weightForLengthStatus: this.classification.split(',')[3].trim(),
      lengthForAgeStatus: this.classification.split(',')[2].trim(),
      weightForAgeStatus: this.classification.split(',')[1].trim(),
    };

    const nutritionalStatusData = {
      childId: this.childId,
      status: this.nutStatus,
      date: new Date(),
    };

    // Update Anthropometric data
    this.childrenService
      .updateAnthropometric(
        this.childId,
        this.anthropometricId,
        anthropometricData
      )
      .subscribe({
        next: (response) => {
          console.log('Anthropometric data updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating anthropometric data:', error);
        },
      });

    // Update Weighing History
    this.childrenService
      .updateWeighingHistory(this.childId, this.weighingId, weighingData)
      .subscribe({
        next: (response: any) => {
          console.log('Weighing history updated successfully:', response);
        },
        error: (error: any) => {
          console.error('Error updating weighing history:', error);
        },
      });

    // Update Nutritional Status
    this.childrenService
      .updateNutritionalStatus(
        this.childId,
        this.nutritionalStatusId,
        nutritionalStatusData
      )
      .subscribe({
        next: (response: any) => {
          console.log('Nutritional status updated successfully:', response);
          this.dialogRef.close(); // Close the dialog after update
        },
        error: (error: any) => {
          console.error('Error updating nutritional status:', error);
        },
      });
    // }
  }
}

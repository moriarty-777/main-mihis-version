import { Component } from '@angular/core';

@Component({
  selector: 'nutritional-status-calc',
  standalone: true,
  imports: [],
  templateUrl: './nutritional-status-calc.component.html',
  styleUrl: './nutritional-status-calc.component.css',
})
export class NutritionalStatusCalcComponent {
  private boysMedian: number[] = [
    3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.5, 9.7, 10.0, 10.3,
    10.5, 10.8, 11.0, 11.3, 11.5, 11.8, 12.0, 12.3, 12.5, 12.8, 13.0, 13.2,
    13.5, 13.7, 13.9, 14.2, 14.4, 14.6, 14.8, 15.1, 15.3, 15.5, 15.7, 15.9,
    16.2, 16.4, 16.6, 16.8, 17.0, 17.3, 17.5, 17.7, 17.9, 18.1, 18.3, 18.5,
    18.7, 18.9, 19.1, 19.3, 19.5, 19.7, 19.9, 20.1,
  ];

  private boysSD: number[] = [
    0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.3, 1.4, 1.4,
    1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9,
    1.9, 2.0, 2.0, 2.0, 2.0, 2.1, 2.1, 2.1, 2.1, 2.2, 2.2, 2.2, 2.2, 2.2, 2.3,
    2.3, 2.3, 2.3, 2.3, 2.4, 2.4, 2.4, 2.4, 2.4, 2.5, 2.5, 2.5, 2.5, 2.5,
  ];

  // Girls' Median and SD (0-59 months)
  private girlsMedian: number[] = [
    3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 8.0, 8.3, 8.6, 8.9, 9.2, 9.4, 9.7,
    9.9, 10.1, 10.4, 10.6, 10.8, 11.1, 11.3, 11.5, 11.7, 11.9, 12.2, 12.4, 12.6,
    12.8, 13.0, 13.2, 13.4, 13.6, 13.8, 14.0, 14.2, 14.4, 14.6, 14.8, 15.0,
    15.2, 15.4, 15.6, 15.8, 16.0, 16.2, 16.4, 16.6, 16.8, 17.0, 17.2, 17.4,
    17.6, 17.8, 18.0, 18.2, 18.4, 18.6, 18.8, 19.0, 19.2,
  ];

  private girlsSD: number[] = [
    0.5, 0.6, 0.6, 0.7, 0.7, 0.8, 0.8, 0.8, 0.9, 0.9, 0.9, 1.0, 1.0, 1.0, 1.0,
    1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3, 1.3, 1.3, 1.3,
    1.4, 1.4, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6,
    1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.8,
  ];

  calculateZScore(gender: string, ageInMonths: number, weight: number): number {
    const median =
      gender === 'male'
        ? this.boysMedian[ageInMonths]
        : this.girlsMedian[ageInMonths];
    const sd =
      gender === 'male' ? this.boysSD[ageInMonths] : this.girlsSD[ageInMonths];
    return (weight - median) / sd;
  }

  classifyWeightForAge(
    gender: string,
    ageInMonths: number,
    weight: number
  ): string {
    const zScore = this.calculateZScore(gender, ageInMonths, weight);
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

  // Example usage:
  ngOnInit() {
    const classification = this.classifyWeightForAge('male', 57, 15.5);
    console.log(classification); // Output: 'Normal'
  }
}

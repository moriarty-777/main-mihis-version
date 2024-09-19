import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';

@Component({
  selector: 'charts-complete-immunization',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './charts-complete-immunization.component.html',
  styleUrl: './charts-complete-immunization.component.css',
})
export class ChartsCompleteImmunizationComponent {
  @Input() fullyVaccinatedCount: number = 0;
  @Input() partiallyVaccinatedCount: number = 0;
  @Input() notVaccinatedCount: number = 0;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Get a reference to the chart

  completeImmunizationChartData: ChartData<'bar'> = {
    labels: ['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'],
    datasets: [
      {
        data: [0, 0, 0], // Start with empty data
        backgroundColor: ['#549280', '#a3dccb', '#f48c42'], // Third value added: Soft orange color
        hoverBackgroundColor: ['#338c72', '#8ce8cd', '#ff7043'],
        borderWidth: 0, // No border to keep it clean
        label: 'Immunization Status',
      },
    ],
  };

  ngOnChanges() {
    this.completeImmunizationChartData.datasets[0].data = [
      this.fullyVaccinatedCount,
      this.partiallyVaccinatedCount,
      this.notVaccinatedCount,
    ];

    if (this.chart) {
      this.chart.update();
    }
  }

  // completeImmunizationChartData: ChartData<'bar'> = {
  //   labels: ['Immunization Status'],
  //   datasets: [
  //     {
  //       data: [0], // Fully Vaccinated data (this will be updated dynamically)
  //       backgroundColor: ['#549280'], // Green color
  //       hoverBackgroundColor: ['#338c72'],
  //       borderWidth: 0,
  //       label: 'Fully Vaccinated', // Label for this dataset
  //     },
  //     {
  //       data: [0], // Partially Vaccinated data
  //       backgroundColor: ['#a3dccb'], // Light green color
  //       hoverBackgroundColor: ['#8ce8cd'],
  //       borderWidth: 0,
  //       label: 'Partially Vaccinated', // Label for this dataset
  //     },
  //     {
  //       data: [0], // Not Vaccinated data
  //       backgroundColor: ['#f48c42'], // Soft orange color
  //       hoverBackgroundColor: ['#ff7043'],
  //       borderWidth: 0,
  //       label: 'Not Vaccinated', // Label for this dataset
  //     },
  //   ],
  // };

  // ngOnChanges() {
  //   // Update the datasets with dynamic data
  //   this.completeImmunizationChartData.datasets[0].data = [
  //     this.fullyVaccinatedCount,
  //   ]; // Update Fully Vaccinated
  //   this.completeImmunizationChartData.datasets[1].data = [
  //     this.partiallyVaccinatedCount,
  //   ]; // Update Partially Vaccinated
  //   this.completeImmunizationChartData.datasets[2].data = [
  //     this.notVaccinatedCount,
  //   ]; // Update Not Vaccinated

  //   // Update the chart to reflect the new data
  //   if (this.chart) {
  //     this.chart.update();
  //   }
  // }
}

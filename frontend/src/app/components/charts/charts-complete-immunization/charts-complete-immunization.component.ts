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
}

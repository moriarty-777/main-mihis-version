import { ChartData } from 'chart.js';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'charts-gender',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './charts-gender.component.html',
  styleUrl: './charts-gender.component.css',
})
export class ChartsGenderComponent {
  @Input() maleCount: number = 0;
  @Input() femaleCount: number = 0;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Get a reference to the chart

  genderChartData: ChartData<'pie'> = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [0, 0], // Start with empty data
        backgroundColor: ['#549280', '#a3dccb'], // Softer tones for Male and Female
        hoverBackgroundColor: ['#338c72', '#8ce8cd'], // Hover colors
        borderWidth: 0, // No border to keep it clean
      },
    ],
  };

  ngOnChanges() {
    this.genderChartData.datasets[0].data = [this.maleCount, this.femaleCount];

    if (this.chart) {
      this.chart.update();
    }
  }
}

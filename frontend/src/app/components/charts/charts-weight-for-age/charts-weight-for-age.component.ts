import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'charts-weight-for-age',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './charts-weight-for-age.component.html',
  styleUrl: './charts-weight-for-age.component.css',
})
export class ChartsWeightForAgeComponent {
  @Input() weightForAgeData: { [key: string]: number } = {};

  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4CAF50', '#FFC107', '#FF5722', '#FF4081'],
      },
    ],
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['weightForAgeData'] &&
      Object.keys(this.weightForAgeData).length > 0
    ) {
      this.updateChartData();
    }
  }

  updateChartData() {
    // Only update if there is data in weightForAgeData
    if (Object.keys(this.weightForAgeData).length > 0) {
      this.chartData.labels = Object.keys(this.weightForAgeData);
      this.chartData.datasets[0].data = Object.values(this.weightForAgeData);
      console.log('Chart Labels:', this.chartData.labels);
      console.log('Chart Data:', this.chartData.datasets[0].data);
      this.chartData.datasets[0].backgroundColor = this.chartData.labels.map(
        (label) => this.colorMap[label as string] || '#000000'
      ); // Default to black if label not found
      if (this.chart) {
        this.chart.update();
      }
    } else {
      console.log('Data Consistency Check: No data available for chart update');
    }
  }

  colorMap: { [key: string]: string } = {
    Normal: '#4CAF50', // Green
    Overweight: '#FFC107', // Yellow
    Underweight: '#FF5722', // Orange
    'Severely Wasted': '#FF4081', // Red
    Wasted: '#03A9F4', // Light Blue
    Obese: '#9C27B0', // Purple
    Tall: '#8BC34A', // Light Green
    Stunted: '#E91E63', // Pink
    'Severely Stunted': '#FF9800', // Deep Orange
  };
}

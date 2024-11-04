import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'charts-weight-for-height',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './charts-weight-for-height.component.html',
  styleUrl: './charts-weight-for-height.component.css',
})
export class ChartsWeightForHeightComponent {
  @Input() weightForHeightData: { [key: string]: number } = {};

  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#4CAF50',
          '#FFC107',
          '#FF5722',
          '#FF4081',
          '#03A9F4',
        ],
      },
    ],
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      'ngOnChanges triggered for weightForHeightData:',
      changes['weightForHeightData']
    );
    if (
      changes['weightForHeightData'] &&
      Object.keys(this.weightForHeightData).length > 0
    ) {
      console.log(
        'Received weightForHeightData in child component:',
        this.weightForHeightData
      );
      this.updateChartData();
    }
  }

  updateChartData() {
    if (Object.keys(this.weightForHeightData).length > 0) {
      this.chartData.labels = Object.keys(this.weightForHeightData);
      this.chartData.datasets[0].data = Object.values(this.weightForHeightData);
      console.log('Chart Labels:', this.chartData.labels); // Expected: ['Normal', 'Overweight', ...]
      console.log('Chart Data:', this.chartData.datasets[0].data); // Expected: [85, 10, ...]
      this.chartData.datasets[0].backgroundColor = this.chartData.labels.map(
        (label) => this.colorMap[label as string] || '#000000'
      ); // Default to black if label not found
      if (this.chart) {
        this.chart.update();
      }
    } else {
      console.warn('Weight for Height data is empty or undefined');
    }
  }
  // Define color
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

import { ChartData } from 'chart.js';
import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'charts-nutritional-status',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './charts-nutritional-status.component.html',
  styleUrl: './charts-nutritional-status.component.css',
})
export class ChartsNutritionalStatusComponent {
  @Input() nutritionalData: number[] = [];
  @Input() nutritionalLabels: string[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  nutritionalChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#549280', '#a3dccb', '#80AF81', '#D6EFD8'],
        hoverBackgroundColor: ['#338c72', '#8ce8cd', '#6B9271', '#B5DAC1'],
        borderWidth: 0,
      },
    ],
  };

  ngOnChanges() {
    this.nutritionalChartData.labels = [...this.nutritionalLabels];
    this.nutritionalChartData.datasets[0].data = [...this.nutritionalData];

    if (this.chart) {
      this.chart.update();
    }
  }
}

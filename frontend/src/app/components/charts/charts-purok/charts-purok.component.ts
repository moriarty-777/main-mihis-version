import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'charts-purok',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './charts-purok.component.html',
  styleUrl: './charts-purok.component.css',
})
export class ChartsPurokComponent {
  @Input() purokData: number[] = [];
  @Input() purokLabels: string[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  purokChartData: ChartData<'doughnut'> = {
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
    this.purokChartData.labels = [...this.purokLabels];
    this.purokChartData.datasets[0].data = [...this.purokData];

    if (this.chart) {
      this.chart.update();
    }
  }
}

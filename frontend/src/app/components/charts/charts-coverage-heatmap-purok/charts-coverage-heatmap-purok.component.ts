import { Component, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'charts-coverage-heatmap-purok',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './charts-coverage-heatmap-purok.component.html',
  styleUrl: './charts-coverage-heatmap-purok.component.css',
})
export class ChartsCoverageHeatmapPurokComponent {
  @Input() purokCoverageData: { label: string; value: number }[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  heatmapChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Vaccination Coverage (%)',
        data: [],
        backgroundColor: [
          '#006400',
          '#32CD32',
          '#ADFF2F',
          '#FFD700',
          '#8FBC8F',
        ],
        borderWidth: 1,
      },
    ],
  };

  heatmapChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  ngOnChanges() {
    if (this.purokCoverageData.length) {
      this.heatmapChartData.labels = this.purokCoverageData.map(
        (data) => data.label
      );
      this.heatmapChartData.datasets[0].data = this.purokCoverageData.map(
        (data) => data.value
      );
      if (this.chart) {
        this.chart.update();
      }
    }
  }
}

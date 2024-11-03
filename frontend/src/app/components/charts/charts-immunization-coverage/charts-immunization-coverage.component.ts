import { Component, inject, Input, ViewChild } from '@angular/core';
import { AnalyticReportsService } from '../../../services/analytic-reports.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';

@Component({
  selector: 'charts-immunization-coverage',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './charts-immunization-coverage.component.html',
  styleUrl: './charts-immunization-coverage.component.css',
})
export class ChartsImmunizationCoverageComponent {
  // @Input() vaccineDoses: {
  //   vaccineName: string;
  //   doseNumber: number;
  //   count: number;
  // }[] = [];
  @Input() vaccineDoses: {
    vaccineName: string;
    doseNumber: number;
    maleCount: number;
    femaleCount: number;
    totalCount: number;
  }[] = [];

  vaccineChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit(): void {
    this.prepareChartData();
  }

  ngOnChanges(): void {
    // Update the chart whenever the input data changes
    this.prepareChartData();
  }

  prepareChartData(): void {
    // Extract unique vaccine names and doses
    const vaccineNames = Array.from(
      new Set(this.vaccineDoses.map((dose) => dose.vaccineName))
    );
    const doseNumbers = Array.from(
      new Set(this.vaccineDoses.map((dose) => dose.doseNumber))
    ).sort();

    // Set chart labels to show dose numbers
    this.vaccineChartData.labels = doseNumbers.map((dose) => `Dose ${dose}`);

    // Prepare dataset for each vaccine
    this.vaccineChartData.datasets = vaccineNames.map((vaccine) => {
      const doseCounts = doseNumbers.map((doseNumber) => {
        const dose = this.vaccineDoses.find(
          (d) => d.vaccineName === vaccine && d.doseNumber === doseNumber
        );
        return dose ? dose.totalCount : 0;
      });

      return {
        label: vaccine,
        data: doseCounts,
        backgroundColor: this.getColor(vaccine),
      };
    });

    // Update chart after data is prepared
    if (this.chart) {
      this.chart.update();
    }
  }

  getColor(vaccine: string): string {
    const colors: { [key: string]: string } = {
      BCG: '#4CAF50',
      'Hepatitis B': '#FFC107',
      IPV: '#FF5722',
      MMR: '#03A9F4',
      OPV: '#9C27B0',
      PCV: '#FFEB3B',
      Pentavalent: '#8BC34A',
    };

    return colors[vaccine] || '#8BC34A'; // Default color if vaccine name not found
  }
}

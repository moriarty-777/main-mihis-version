import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Child } from '../../../shared/models/child';

@Component({
  selector: 'charts-radar-vaccine-type',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './charts-radar-vaccine-type.component.html',
  styleUrl: './charts-radar-vaccine-type.component.css',
})
export class ChartsRadarVaccineTypeComponent implements OnChanges {
  @Input() child!: Child;

  // Complete list of all vaccine types that should always appear on the chart
  radarChartLabels: string[] = [
    'BCG',
    'Hepatitis B Vaccine',
    'Pentavalent Vaccine',
    'Oral Polio Vaccine (OPV)',
    'Inactivated Polio Vaccine (IPV)',
    'Pneumococcal Conjugate Vaccine (PCV)',
    'Measles, Mumps, Rubella Vaccine (MMR)',
  ];

  radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        label: 'Vaccine Doses',
        data: [], // This will be filled dynamically
        backgroundColor: 'rgba(92, 194, 184, 0.5)', // Light teal background
        borderColor: 'rgba(92, 194, 184, 1)', // Teal border
        pointBackgroundColor: 'rgba(92, 194, 184, 1)', // Teal points
        // pointRadius: 0, // Removes the dots
        // pointHoverRadius: 0,
      },
    ],
  };

  ngOnChanges() {
    if (this.child && this.child.vaccinations) {
      this.generateChartData();
    }
  }

  generateChartData() {
    // Initialize dose count to 0 for each vaccine type
    const vaccineDoseCount: { [vaccineType: string]: number } = {
      BCG: 0,
      'Hepatitis B Vaccine': 0,
      'Pentavalent Vaccine': 0,
      'Oral Polio Vaccine (OPV)': 0,
      'Inactivated Polio Vaccine (IPV)': 0,
      'Pneumococcal Conjugate Vaccine (PCV)': 0,
      'Measles, Mumps, Rubella Vaccine (MMR)': 0,
    };

    // Count the doses for the vaccines the child has received
    this.child.vaccinations.forEach((vaccine) => {
      if (vaccineDoseCount[vaccine.vaccineType] !== undefined) {
        vaccineDoseCount[vaccine.vaccineType]++;
      }
    });

    // // Prepare the data for the radar chart (order matters!)
    // const doseData = this.radarChartLabels.map(
    //   (vaccineType) => vaccineDoseCount[vaccineType]
    // );
    // Dynamically calculate doses received per vaccine
    const vaccineData = this.radarChartLabels.map((label) => {
      const dosesReceived = this.child.vaccinations.filter(
        (vac) => vac.vaccineType === label
      ).length;
      return dosesReceived; // Return how many doses of this specific vaccine were received
    });

    // Update chart data
    this.radarChartData = {
      labels: this.radarChartLabels,
      datasets: [
        {
          label: 'Vaccine Doses',
          data: vaccineData,
          backgroundColor: 'rgba(92, 194, 184, 0.5)', // Adjust as needed
          borderColor: 'rgba(92, 194, 184, 1)', // Adjust as needed
          pointBackgroundColor: 'rgba(92, 194, 184, 1)', // Adjust as needed
          // pointRadius: 0, // Removes the dots
          // pointHoverRadius: 0,
        },
      ],
    };
  }

  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    scales: {
      r: {
        min: 0,
        max: 3,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // This will remove the legend
      },
    },
  };

  /*  // FIXME:
  @Input() child!: Child;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  radarChartLabels: string[] = [
    'BCG',
    'Hepatitis B Vaccine',
    'Pentavalent Vaccine',
    'Oral Polio Vaccine (OPV)',
    'Pneumococcal Conjugate Vaccine (PCV)',
    'Inactivated Polio Vaccine (IPV)',
    'Measles, Mumps, Rubella Vaccine (MMR)',
  ];

  radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        label: 'Vaccine Doses',
        data: [1, 1, 3, 3, 3, 2, 2], // Number of doses for each vaccine type
        backgroundColor: 'rgba(92, 194, 184, 0.5)', // Light teal background (adjust as needed)
        borderColor: 'rgba(92, 194, 184, 1)', // Teal border
        pointBackgroundColor: 'rgba(92, 194, 184, 1)', // Teal points
        // pointRadius: 0, // Removes the dots
        // pointHoverRadius: 0,
      },
    ],
  };

  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    scales: {
      r: {
        min: 0,
        max: 3,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // This will remove the legend
      },
    },
  };

  ngOnChanges() {
    if (this.chart) {
      this.chart.update(); // Ensure the chart updates when child data changes
    }
  }
// FIXME: */
  // radarChartOptions: ChartOptions<'radar'> = {
  //   responsive: true,
  //   scales: {
  //     r: {
  //       min: 0, // Starts from 0
  //       max: 3, // Max number of doses is 3 for OPV, Pentavalent, and PCV
  //       ticks: {
  //         stepSize: 1, // Step size of 1
  //       },
  //     },
  //   },
  // };

  // radarChartOptions: ChartOptions<'radar'> = {
  //   responsive: true,
  //   maintainAspectRatio: false, // Ensures the chart adapts to its container's size
  //   devicePixelRatio: 2, // Set a higher pixel ratio for crisper rendering
  //   scales: {
  //     r: {
  //       min: 0,
  //       max: 3,
  //       ticks: {
  //         stepSize: 1,
  //       },
  //     },
  //   },
  // };
}

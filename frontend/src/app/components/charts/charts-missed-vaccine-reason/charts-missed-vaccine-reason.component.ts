import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { AnalyticReportsService } from '../../../services/analytic-reports.service';

@Component({
  selector: 'charts-missed-vaccine-reason',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './charts-missed-vaccine-reason.component.html',
  styleUrl: './charts-missed-vaccine-reason.component.css',
})
export class ChartsMissedVaccineReasonComponent {
  @Input() missedVaccineReasons: { label: string; value: number }[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  missedVaccineChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        // Updated to a greenish color palette for bar chart
        backgroundColor: [
          '#3CB371', // Child Was Sick (Medium Sea Green)
          '#66CDAA', // Lack of Awareness (Medium Aquamarine)
          '#98FB98', // Transportation Problems (Pale Green)
          '#2E8B57', // Went Out of Town (Sea Green)
          '#8FBC8F', // Parental Refusal (Dark Sea Green)
          '#20B2AA', // Fear of Side Effects (Light Sea Green)
          '#ADFF2F', // Other (Green Yellow)
        ],
        hoverBackgroundColor: [
          '#2E8B57', // Darker shade for Child Was Sick
          '#5DC9A0', // Darker shade for Lack of Awareness
          '#90EE90', // Darker shade for Transportation Problems
          '#276B46', // Darker shade for Went Out of Town
          '#7DA376', // Darker shade for Parental Refusal
          '#1A958A', // Darker shade for Fear of Side Effects
          '#9DE72E', // Darker shade for Other
        ],
        borderWidth: 1,
        label: 'Reason for Missed Vaccine',
      },
    ],
  };
  ngOnChanges() {
    // Update labels with reason labels (e.g., 'Health Issues', 'Transportation Problems', etc.)
    this.missedVaccineChartData.labels = this.missedVaccineReasons.map(
      (reason) => reason.label
    );

    // Update data with reason values (e.g., the number of occurrences of each reason)
    this.missedVaccineChartData.datasets[0].data =
      this.missedVaccineReasons.map((reason) => reason.value);

    // Update the chart if it is already instantiated
    if (this.chart) {
      this.chart.update();
    }
  }
}

// TODO:
//   missedVaccines: any[] = [];

//   constructor(private analyticReportService: AnalyticReportsService) {}

//   ngOnInit() {
//     this.fetchMissedVaccineReport();
//   }

//   fetchMissedVaccineReport() {
//     this.analyticReportService.getMissedVaccineReport().subscribe(
//       (data: any) => {
//         this.missedVaccines = data;
//       },
//       (error: any) => {
//         console.error('Failed to load missed vaccine report', error);
//       }
//     );
//   }
// }

import { Component, inject, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { Child } from '../../../shared/models/child';
import { ChildService } from '../../../services/child.service';
import { ChartsGenderComponent } from '../../charts/charts-gender/charts-gender.component';
import { ChartsPurokComponent } from '../../charts/charts-purok/charts-purok.component';
import { ChartsCompleteImmunizationComponent } from '../../charts/charts-complete-immunization/charts-complete-immunization.component';
import { ChartsMissedVaccineReasonComponent } from '../../charts/charts-missed-vaccine-reason/charts-missed-vaccine-reason.component';
import { ChartsCoverageHeatmapPurokComponent } from '../../charts/charts-coverage-heatmap-purok/charts-coverage-heatmap-purok.component';
import { CommonModule } from '@angular/common';
import { AnalyticReportsService } from '../../../services/analytic-reports.service';
import { ChartsImmunizationCoverageComponent } from '../../charts/charts-immunization-coverage/charts-immunization-coverage.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    ChartsGenderComponent,
    ChartsPurokComponent,
    ChartsCompleteImmunizationComponent,
    ChartsMissedVaccineReasonComponent,
    ChartsCoverageHeatmapPurokComponent,
    ChartsImmunizationCoverageComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent {
  private childService = inject(ChildService);
  private analyticReportsService = inject(AnalyticReportsService);
  maleCount: number = 0;
  femaleCount: number = 0;

  fullyVaccinatedCount: number = 0;
  partiallyVaccinatedCount: number = 0;
  notVaccinatedCount: number = 0;

  // Text to hold the immunization report summary
  vaccinationSummaryText: string = '';

  vaccineDoses: {
    vaccineName: string;
    doseNumber: number;
    maleCount: number;
    femaleCount: number;
    totalCount: number;
  }[] = [];

  purokLabels: string[] = []; // Dynamic labels for Purok
  purokData: number[] = []; // Dynamic data for Purok

  missedVaccineReasons: { label: string; value: number }[] = [];
  mostCommonReason: string = '';
  mostCommonReasonCount: number = 0;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  ngOnInit() {
    this.loadChildren(); // Fetch data on initialization
    this.loadVaccinationSummary(); // Fetch immunization data
    this.loadVaccineDoseCounts();
    // TODO: Hard coded data
    this.loadMissedVaccineData(); // Fetch missed vaccine data
    this.loadCoveragePurok();
  }

  loadMissedVaccineData() {
    this.analyticReportsService.getMissedVaccineReport().subscribe(
      (data: any[]) => {
        // Log the response data structure to understand the fields
        console.log('Raw Missed Vaccine Report Data:', data);

        // Initialize a map to count occurrences of each reason
        const reasonCounts = new Map<string, number>();

        // Iterate through each child and their missed vaccines to count reasons
        data.forEach((child) => {
          child.missedVaccines.forEach((vaccine: any) => {
            const reason = vaccine.reason || 'Unknown Reason';
            reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
          });
        });

        // Transform the map to the expected array format for charting
        this.missedVaccineReasons = Array.from(
          reasonCounts,
          ([label, value]) => ({
            label,
            value,
          })
        );

        // Determine the most common reason
        const mostCommon = this.missedVaccineReasons.reduce(
          (prev, current) => (current.value > prev.value ? current : prev),
          { label: '', value: 0 }
        );

        this.mostCommonReason = mostCommon.label;
        this.mostCommonReasonCount = mostCommon.value;

        console.log(
          'Transformed Missed Vaccine Reasons:',
          this.missedVaccineReasons
        );
      },
      (error) => {
        console.error('Failed to load missed vaccine report', error);
      }
    );
  }

  loadVaccineDoseCounts(): void {
    this.analyticReportsService.getVaccineDoseCounts().subscribe(
      (data) => {
        // Assuming data from backend already has maleCount, femaleCount, and totalCount
        this.vaccineDoses = data.map((dose) => ({
          vaccineName: dose.vaccineName,
          doseNumber: dose.doseNumber,
          maleCount: dose.maleCount || 0,
          femaleCount: dose.femaleCount || 0,
          totalCount: dose.totalCount || 0,
        }));

        console.log('Transformed Vaccine Doses:', this.vaccineDoses);
      },
      (error) => {
        console.error('Failed to load vaccine dose counts', error);
      }
    );
  }

  loadCoveragePurok() {
    // Hardcoded data for now, you can replace this with an API call once the database is set up
    console.log('Missed Vaccine Data:', this.missedVaccineReasons); // Debugging
  }

  // FIXME: End hard coded data

  loadChildren() {
    this.childService.getAll().subscribe((children: Child[]) => {
      // Gender counts
      this.maleCount = children.filter(
        (child) => child.gender === 'Male'
      ).length;
      this.femaleCount = children.filter(
        (child) => child.gender === 'Female'
      ).length;

      // Purok counts
      const purokCountMap: { [key: string]: number } = {};

      children.forEach((child) => {
        const purok = `Purok ${child.purok}`; // Ensure "Purok" prefix is added
        if (purokCountMap[purok]) {
          purokCountMap[purok]++;
        } else {
          purokCountMap[purok] = 1;
        }
      });
      // Extract labels and data for the Purok chart
      this.purokLabels = Object.keys(purokCountMap) // Labels: Purok 1, Purok 2, etc.
        .sort((a, b) => {
          // Extract numerical parts and sort numerically
          const numA = parseInt(a.replace('Purok ', ''));
          const numB = parseInt(b.replace('Purok ', ''));
          return numA - numB;
        });

      this.purokData = this.purokLabels.map((label) => purokCountMap[label]);
    });
  }

  loadVaccinationSummary() {
    this.childService.getVaccinationSummary().subscribe((summary) => {
      this.fullyVaccinatedCount = summary.fullyVaccinatedCount;
      this.partiallyVaccinatedCount = summary.partiallyVaccinatedCount;
      this.notVaccinatedCount = summary.notVaccinatedCount;
    });
  }

  // Malnourishment Data (Hardcoded)
  malnourishmentData: { label: string; value: number }[] = [
    { label: 'Normal', value: 70 },
    { label: 'Malnourished', value: 30 },
  ];

  // Chart data for malnourishment and normal status
  malnourishmentChartData: ChartData<'bar'> = {
    labels: ['Normal', 'Malnourished'],
    datasets: [
      {
        data: this.getMalnourishmentData(), // Retrieve malnourishment data
        backgroundColor: ['#4CAF50', '#FF5722'], // Green for Normal, Red for Malnourished
        hoverBackgroundColor: ['#388E3C', '#E64A19'],
        borderWidth: 1,
        label: 'Nutritional Status',
      },
    ],
  };

  // Helper method to retrieve malnourishment data
  getMalnourishmentData() {
    return this.malnourishmentData.map((status) => status.value);
  }
} //FIXME: END
// // HHEHEHE
// vaccineAdministeredData: { label: string; count: number }[] = [
//   { label: 'BCG', count: 45 },
//   { label: 'Pentavalent', count: 32 },
//   { label: 'OPV', count: 50 },
//   { label: 'IPV', count: 40 },
//   { label: 'PCV', count: 35 },
//   { label: 'MMR', count: 38 },
// ];

// vaccineChartData: ChartData<'bar'> = {
//   labels: this.vaccineAdministeredData.map((vaccine) => vaccine.label), // Labels: BCG, Pentavalent, etc.
//   datasets: [
//     {
//       data: this.vaccineAdministeredData.map((vaccine) => vaccine.count), // Counts: 45, 32, etc.
//       backgroundColor: [
//         '#4CAF50',
//         '#FFC107',
//         '#FF5722',
//         '#03A9F4',
//         '#9C27B0',
//         '#FFEB3B',
//       ], // Different colors for each bar
//       label: 'Vaccines Administered',
//     },
//   ],
// };

// TODO: EndHardcoded Data

// data: ChartData<'bar'> = {
//   labels: [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sept',
//     'Oct',
//     'Nov',
//     'Dec',
//   ],
//   datasets: [
//     {
//       data: this.getSubs(),
//       backgroundColor: ['#549280'],
//       label: 'subs',
//     },
//     {
//       data: this.getWatchTime(),
//       backgroundColor: ['#a3dccb'],
//       label: 'Watch Time',
//     },
//   ],
// };

// getSubs() {
//   return [100, 200, 300, 250, 500, 450, 150, 200, 550, 350, 200, 300];
// }
// getWatchTime() {
//   return [100, 150, 120, 250, 230, 450, 150, 210, 220, 140, 200, 100];
// }

// // Get headers
// getTotalSubs() {
//   let sum = 0;
//   this.getSubs().forEach((v) => (sum += v));
//   return sum;
// }

// getTotalWatchTime() {
//   let sum = 0;
//   this.getWatchTime().forEach((v) => (sum += v));
//   return sum;
// }

// TODO: Hardcoded Data
// Complete Immunization Coverage Hardcoded Data

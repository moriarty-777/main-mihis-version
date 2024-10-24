import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent {
  private childService = inject(ChildService);
  maleCount: number = 0;
  femaleCount: number = 0;

  fullyVaccinatedCount: number = 0;
  partiallyVaccinatedCount: number = 0;
  notVaccinatedCount: number = 0;

  purokLabels: string[] = []; // Dynamic labels for Purok
  purokData: number[] = []; // Dynamic data for Purok

  // TODO: Hard Coded Data
  missedVaccineReasons: { label: string; value: number }[] = [
    { label: 'Child Was Sick', value: 4 },
    { label: 'Lack of Awareness', value: 5 },
    { label: 'Went Out of Town', value: 6 },
    { label: 'Parental Refusal', value: 3 },
    { label: 'Fear of Side Effects', value: 8 },
    { label: 'Other', value: 1 },
  ];

  purokCoverageData: { label: string; value: number }[] = [
    { label: 'Purok 1', value: 85 },
    { label: 'Purok 2', value: 60 },
    { label: 'Purok 3', value: 95 },
    { label: 'Purok 4', value: 40 },
    { label: 'Purok 5', value: 75 },
  ];

  // FIXME: End hard coded data

  ngOnInit() {
    this.loadChildren(); // Fetch data on initialization
    this.loadVaccinationSummary(); // Fetch immunization data
    // TODO: Hard coded data
    this.loadMissedVaccineData(); // Fetch missed vaccine data
    this.loadCoveragePurok();
  }
  // TODO: Hard coded data
  loadMissedVaccineData() {
    // Hardcoded data for now, you can replace this with an API call once the database is set up
    console.log('Missed Vaccine Data:', this.missedVaccineReasons); // Debugging
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

      console.log('Purok Labels:', this.purokLabels); // Debugging
      console.log('Purok Data:', this.purokData); // Debugging
    });
  }

  loadVaccinationSummary() {
    this.childService.getVaccinationSummary().subscribe((summary) => {
      this.fullyVaccinatedCount = summary.fullyVaccinatedCount;
      this.partiallyVaccinatedCount = summary.partiallyVaccinatedCount;
      this.notVaccinatedCount = summary.notVaccinatedCount;
    });
  }
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
  // Complete Immunization Coverage Hardcoded Data
  immunizationCoverageData: { label: string; value: number }[] = [
    { label: 'Fully Vaccinated', value: 0 },
    { label: 'Partially Vaccinated', value: 0 },
    { label: 'Not Vaccinated', value: 99 },
  ];

  // Chart data for immunization, using monthly labels
  immunizationChartData: ChartData<'bar'> = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: this.getFullyVaccinated(), // Fully vaccinated data for each month
        backgroundColor: ['#4CAF50'], // Green for Fully Vaccinated
        label: 'Fully Vaccinated',
      },
      {
        data: this.getPartiallyVaccinated(), // Partially vaccinated data for each month
        backgroundColor: ['#FFC107'], // Yellow for Partially Vaccinated
        label: 'Partially Vaccinated',
      },
      {
        data: this.getNotVaccinated(), // Not vaccinated data for each month
        backgroundColor: ['#FF5722'], // Red for Not Vaccinated
        label: 'Not Vaccinated',
      },
    ],
  };

  // Load immunization coverage data
  loadImmunizationCoverageData() {
    console.log(
      'Complete Immunization Coverage Data:',
      this.immunizationCoverageData
    ); // Debugging
  }

  // Helper methods for data (mock functions to simulate data retrieval per month)
  getFullyVaccinated() {
    return [23, 1, 55, 7, 43, 12, 17, 15, 18, 18, 43, 55]; // Replace with real data
  }

  getPartiallyVaccinated() {
    return [23, 32, 12, 11, 21, 23, 0, 23, 23, 23, 23, 2]; // Replace with real data
  }

  getNotVaccinated() {
    return [5, 4, 8, 7, 6, 5, 4, 2, 1, 2, 12, 0]; // Replace with real data
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

  // TODO: EndHardcoded Data
}

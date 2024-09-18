import { Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { Child } from '../../../shared/models/child';
import { ChildService } from '../../../services/child.service';
import { ChartsGenderComponent } from '../../charts/charts-gender/charts-gender.component';
import { ChartsPurokComponent } from '../../charts/charts-purok/charts-purok.component';
import { ChartsCompleteImmunizationComponent } from '../../charts/charts-complete-immunization/charts-complete-immunization.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    BaseChartDirective,
    ChartsGenderComponent,
    ChartsPurokComponent,
    ChartsCompleteImmunizationComponent,
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

  ngOnInit() {
    this.loadChildren(); // Fetch data on initialization
    this.loadVaccinationSummary(); // Fetch immunization data
  }

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
      this.purokLabels = Object.keys(purokCountMap); // Labels: Purok 1, Purok 2, etc.
      this.purokData = Object.values(purokCountMap); // Data: [number of children in each purok]

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

  getSubs() {
    return [100, 200, 300, 250, 500, 450, 150, 200, 550, 350, 200, 300];
  }
  getWatchTime() {
    return [100, 150, 120, 250, 230, 450, 150, 210, 220, 140, 200, 100];
  }

  // Get headers
  getTotalSubs() {
    let sum = 0;
    this.getSubs().forEach((v) => (sum += v));
    return sum;
  }

  getTotalWatchTime() {
    let sum = 0;
    this.getWatchTime().forEach((v) => (sum += v));
    return sum;
  }
}

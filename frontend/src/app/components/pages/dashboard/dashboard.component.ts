import { ChartData } from 'chart.js';
import { Component, inject } from '@angular/core';
import { AdminLogsComponent } from '../admin-logs/admin-logs.component';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartsGenderComponent } from '../../charts/charts-gender/charts-gender.component';
import { ChartsPurokComponent } from '../../charts/charts-purok/charts-purok.component';
import { ChartsCompleteImmunizationComponent } from '../../charts/charts-complete-immunization/charts-complete-immunization.component';
import { ChildService } from '../../../services/child.service';
import { Child } from '../../../shared/models/child';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    BaseChartDirective,
    ChartsGenderComponent,
    ChartsPurokComponent,
    ChartsCompleteImmunizationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private userService = inject(UserService);
  public routers = inject(Router);
  user!: User;
  showDashboardBody: boolean = false;

  constructor() {}

  ngOnInit() {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
    this.loadChildren();

    // Listen for navigation events and update showDashboardBody based on exact URL match
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.showDashboardBody = this.router.url === '/dashboard';
    //   });
  }

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
    });
  }
}

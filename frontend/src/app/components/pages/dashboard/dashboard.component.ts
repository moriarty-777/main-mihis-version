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
import { PdfGenerationService } from '../../../services/pdf-generation.service';

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

  private childService = inject(ChildService);
  private pdfService = inject(PdfGenerationService);
  maleCount: number = 0;
  femaleCount: number = 0;

  fullyVaccinatedCount: number = 0;
  partiallyVaccinatedCount: number = 0;
  notVaccinatedCount: number = 0;

  purokLabels: string[] = []; // Dynamic labels for Purok
  purokData: number[] = []; // Dynamic data for Purok

  // Filter
  availableYears: number[] = [];
  selectedTimeframe: string = '24h';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  filteredChildren: Child[] = []; // Store f

  constructor() {}

  ngOnInit() {
    this.initializeAvailableYears();
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
    // this.loadChildren();
    // Fetch all children and update dashboard data initially
    this.childService.getAllFilter().subscribe((children: Child[]) => {
      this.updateDashboardData(children);
    });
  }

  initializeAvailableYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2017; year--) {
      this.availableYears.push(year);
    }
  }

  onTimeframeChange(event: any) {
    this.selectedTimeframe = event.target.value;
    this.applyFilters();
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value
      ? parseInt(event.target.value)
      : null;
    this.applyFilters();
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value
      ? parseInt(event.target.value)
      : null;
    this.applyFilters();
  }

  applyFilters() {
    let startDate: Date | undefined = undefined;
    let endDate: Date | undefined = new Date();

    if (this.selectedYear || this.selectedMonth !== null) {
      startDate = new Date(
        this.selectedYear ?? endDate.getFullYear(),
        this.selectedMonth ?? 0,
        1
      );
      endDate =
        this.selectedMonth !== null
          ? new Date(
              this.selectedYear ?? endDate.getFullYear(),
              (this.selectedMonth ?? 0) + 1,
              0
            )
          : new Date(this.selectedYear ?? endDate.getFullYear(), 11, 31);
    }

    this.childService
      .getAllFilter(startDate, endDate)
      .subscribe((filteredChildren) => {
        this.updateDashboardData(filteredChildren);
        this.filteredChildren = filteredChildren; //
      });
  }

  updateDashboardData(filteredChildren: Child[]) {
    // Update gender counts
    this.maleCount = filteredChildren.filter(
      (child) => child.gender === 'Male'
    ).length;
    this.femaleCount = filteredChildren.filter(
      (child) => child.gender === 'Female'
    ).length;

    // Update vaccination counts
    const requiredVaccines = 15;
    this.fullyVaccinatedCount = filteredChildren.filter(
      (child) => child.vaccinations.length >= requiredVaccines
    ).length;
    this.partiallyVaccinatedCount = filteredChildren.filter(
      (child) =>
        child.vaccinations.length > 0 &&
        child.vaccinations.length < requiredVaccines
    ).length;
    this.notVaccinatedCount = filteredChildren.filter(
      (child) => child.vaccinations.length === 0
    ).length;

    // Update Purok data
    const purokCountMap: { [key: string]: number } = {};

    filteredChildren.forEach((child) => {
      const purok = `Purok ${child.purok}`;
      if (purokCountMap[purok]) {
        purokCountMap[purok]++;
      } else {
        purokCountMap[purok] = 1;
      }
    });

    this.purokLabels = Object.keys(purokCountMap).sort((a, b) => {
      const numA = parseInt(a.replace('Purok ', ''));
      const numB = parseInt(b.replace('Purok ', ''));
      return numA - numB;
    });

    this.purokData = this.purokLabels.map((label) => purokCountMap[label]);
  }

  // loadChildren() {
  //   this.childService.getVaccinationSummary().subscribe((data) => {
  //     this.fullyVaccinatedCount = data.fullyVaccinatedCount;
  //     this.partiallyVaccinatedCount = data.partiallyVaccinatedCount;
  //     this.notVaccinatedCount = data.notVaccinatedCount;
  //   });

  //   this.childService.getAll().subscribe((children: Child[]) => {
  //     // Gender counts
  //     this.maleCount = children.filter(
  //       (child) => child.gender === 'Male'
  //     ).length;
  //     this.femaleCount = children.filter(
  //       (child) => child.gender === 'Female'
  //     ).length;

  //     // Purok counts
  //     const purokCountMap: { [key: string]: number } = {};

  //     children.forEach((child) => {
  //       const purok = `Purok ${child.purok}`; // Ensure "Purok" prefix is added
  //       if (purokCountMap[purok]) {
  //         purokCountMap[purok]++;
  //       } else {
  //         purokCountMap[purok] = 1;
  //       }
  //     });
  //     // Extract labels and data for the Purok chart
  //     this.purokLabels = Object.keys(purokCountMap) // Labels: Purok 1, Purok 2, etc.
  //       .sort((a, b) => {
  //         // Extract numerical parts and sort numerically
  //         const numA = parseInt(a.replace('Purok ', ''));
  //         const numB = parseInt(b.replace('Purok ', ''));
  //         return numA - numB;
  //       });

  //     this.purokData = this.purokLabels.map((label) => purokCountMap[label]);
  //   });
  // }

  // generateVaccinationPdf() {
  //   const requiredVaccines = 15;
  //   const enrichedChildren = this.filteredChildren.map((child) => {
  //     const vaccineCount = child.vaccinations.length;
  //     let vaccineStatus = 'Not Vaccinated';

  //     if (vaccineCount >= requiredVaccines) {
  //       vaccineStatus = 'Fully Vaccinated';
  //     } else if (vaccineCount > 0) {
  //       vaccineStatus = 'Partially Vaccinated';
  //     }

  //     return {
  //       firstName: child.firstName,
  //       lastName: child.lastName,
  //       vaccineStatus,
  //       purok: child.purok,
  //       barangay: child.barangay,
  //     };
  //   });

  //   this.pdfService.generateChildVaccinationStatusPdf(enrichedChildren);
  // }
  generateVaccinationPdf() {
    const requiredVaccines = 15;
    const enrichedChildren = this.filteredChildren.map((child) => {
      const vaccineCount = child.vaccinations.length;
      let vaccineStatus = 'Not Vaccinated';

      if (vaccineCount >= requiredVaccines) {
        vaccineStatus = 'Fully Vaccinated';
      } else if (vaccineCount > 0) {
        vaccineStatus = 'Partially Vaccinated';
      }

      return {
        firstName: child.firstName,
        lastName: child.lastName,
        vaccineStatus,
        purok: child.purok,
        barangay: child.barangay,
      };
    });

    // Format the month and year for display
    const year = this.selectedYear ? this.selectedYear.toString() : '';
    const month =
      this.selectedMonth !== null
        ? new Date(0, this.selectedMonth).toLocaleString('default', {
            month: 'long',
          })
        : '';

    // Pass enriched children, year, and month to the PDF generation service
    this.pdfService.generateChildVaccinationStatusPdf(
      enrichedChildren,
      year,
      month
    );
  }
}

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
import { ChartsNutritionalStatusComponent } from '../../charts/charts-nutritional-status/charts-nutritional-status.component';
import { FormsModule } from '@angular/forms';

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
    ChartsNutritionalStatusComponent,
    FormsModule,
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

  nutritionalStatus: string | null = null;
  normalCount: number = 0;
  malnourishedCount: number = 0;

  purokLabels: string[] = []; // Dynamic labels for Purok
  purokData: number[] = []; // Dynamic data for Purok

  // Filter
  availableYears: number[] = [];
  selectedTimeframe: string = '24h';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  // New properties for Purok and Gender filters
  selectedPurok: string | null = null;
  selectedGender: string | null = null;

  filteredChildren: Child[] = []; // Store f

  // Add a new property to manage default year and month
  defaultYear: number | null = new Date().getFullYear();
  defaultMonth: number | null = null;

  userRole!: string;

  constructor() {
    this.userService.userObservable.subscribe((user) => {
      this.userRole = user.role;
    });
  }

  // TODO:

  currentView: string = 'vaccination';

  resetAllFilters() {
    // Reset each filter to default
    this.selectedPurok = '';
    this.selectedGender = '';
    this.selectedMonth = null;
    this.selectedYear = this.defaultYear;

    // Apply the default filter values
    this.applyFilters();
  }
  // Event handler for Purok change
  onPurokChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedPurok = selectedValue
      ? selectedValue.replace('Purok ', '')
      : null; // Removes 'Purok ' prefix
    this.applyFilters();
  }

  // Event handler for Gender change
  onGenderChange(event: any) {
    console.log('Selected Gender:', this.selectedGender);
    this.selectedGender = event.target.value || null;
    this.applyFilters();
  }

  // Methods to toggle the view
  // Methods to toggle the view with filter reset
  showVaccinationTable() {
    this.currentView = 'vaccination';
    this.resetFilters(); // Reset filters
    this.applyFilters(); // Reapply filters to load relevant data
  }

  showMalnutritionTable() {
    this.currentView = 'malnutrition';
    this.resetFilters(); // Reset filters
    this.applyFilters(); // Reapply filters to load relevant data
  }

  // Function to reset filters
  resetFilters() {
    this.selectedYear = this.defaultYear;
    this.selectedMonth = this.defaultMonth;
  }

  ngOnInit() {
    this.purokLabels = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4']; // Full list of Purok labels
    this.initializeAvailableYears();

    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
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

  //
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

    // Determine filter type based on current view
    const filterType =
      this.currentView === 'malnutrition' ? 'malnutrition' : 'vaccination';

    // Construct filter object only with valid values
    const filters: any = {};
    if (this.selectedPurok && this.selectedPurok !== 'Select Purok') {
      filters.purok = this.selectedPurok;
    }
    if (this.selectedGender) {
      filters.gender = this.selectedGender;
    }

    // Fetch filtered children data with the specified filter type
    this.childService
      .getAllFilter(startDate, endDate, filters, filterType)
      .subscribe((filteredChildren) => {
        console.log('Filtered Children from Backend:', filteredChildren); //
        this.updateDashboardData(filteredChildren);
        this.filteredChildren = filteredChildren;
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

    // Update nutritional status counts
    this.normalCount = filteredChildren.filter(
      (child) => child.nutritionalStatus?.status === 'Normal'
    ).length;
    this.malnourishedCount = filteredChildren.filter(
      (child) => child.nutritionalStatus?.status === 'Malnourished'
    ).length;

    console.log('Normal Count:', this.normalCount);
    console.log('Malnourished Count:', this.malnourishedCount);

    // Update purok data for chart display without modifying purokLabels
    const purokCountMap: { [key: string]: number } = {};
    filteredChildren.forEach((child) => {
      const purok = `Purok ${child.purok}`;
      if (purokCountMap[purok]) {
        purokCountMap[purok]++;
      } else {
        purokCountMap[purok] = 1;
      }
    });
    this.purokData = this.purokLabels.map((label) => purokCountMap[label] || 0); // Use existing labels and map counts
  }

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
        gender: child.gender,
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

  generateNutritionalStatusPdf() {
    // Filter to include only malnourished children
    // const malnourishedChildren = this.filteredChildren.filter(
    //   (child) => child.nutritionalStatus?.status === 'Malnourished'
    // );

    const enrichedChildren = this.filteredChildren.map((child: any) => ({
      firstName: child.firstName,
      lastName: child.lastName,
      nutritionalStatus: child.nutritionalStatus?.status || 'Unknown',
      purok: child.purok,
      barangay: child.barangay,
      gender: child.gender,
    }));

    // Format the month and year for display
    const year = this.selectedYear ? this.selectedYear.toString() : '';
    const month =
      this.selectedMonth !== null
        ? new Date(0, this.selectedMonth).toLocaleString('default', {
            month: 'long',
          })
        : '';

    // Call the nutritional status PDF generator with only malnourished children
    this.pdfService.generateChildNutritionalStatusPdf(
      enrichedChildren,
      year,
      month
    );
  }

  generatePdf() {
    if (this.currentView === 'malnutrition') {
      this.generateNutritionalStatusPdf();
    } else {
      this.generateVaccinationPdf();
    }
  }
}

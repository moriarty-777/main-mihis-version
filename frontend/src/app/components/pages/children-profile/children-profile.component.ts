import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Child } from '../../../shared/models/child';
import { ChildService } from '../../../services/child.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationComponent } from '../../partials/pagination/pagination.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VaccinePopupComponent } from '../../partials/vaccine-popup/vaccine-popup.component';
import { Vaccination } from '../../../shared/models/vaccination';
import { ChangeDetectorRef } from '@angular/core';
import { ChartsRadarVaccineTypeComponent } from '../../charts/charts-radar-vaccine-type/charts-radar-vaccine-type.component';
import { PopupAddVaccinationComponent } from '../../partials/popup-add-vaccination/popup-add-vaccination.component';
import { PopupUpdateVaccinationComponent } from '../../partials/popup-update-vaccination/popup-update-vaccination.component';
import { PopupUpdateNutriCalcComponent } from '../../partials/popup-update-nutri-calc/popup-update-nutri-calc.component';
import { PopupAddAefiComponent } from '../../partials/popup-add-aefi/popup-add-aefi.component';

@Component({
  selector: 'app-children-profile',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    CommonModule,
    PaginationComponent,
    MatDialogModule,
    ChartsRadarVaccineTypeComponent,
  ],
  templateUrl: './children-profile.component.html',
  styleUrl: './children-profile.component.css',
})
export class ChildrenProfileComponent {
  private dialogRef = inject(MatDialog);
  // Align the tooltip at top center
  vaccineCount = 'Number of Vaccine Administered / Total Required Vaccine';
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);

  vaccinationSchedule: any;
  missedVaccineCount: number = 0;

  child!: Child;
  motherName!: any;
  motherId!: any;
  midwives!: { _id: string; firstName: string; lastName: string }[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private childrenService: ChildService,
    private cdr: ChangeDetectorRef
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.loadChildProfile(params['id']); // Handle everything inside loadChildProfile
      }
    });
  }

  // show schedule of child
  showSchedule = false; // Initially set to false

  // Method to toggle the visibility of the schedule
  toggleSchedule() {
    this.showSchedule = !this.showSchedule;
  }

  // Missed Vaccine
  loadChildProfile(id: string) {
    this.childrenService.getChildrenById(id).subscribe((data) => {
      this.child = data.child;
      this.motherName = `${data.mother.firstName} ${data.mother.lastName}`;
      this.motherId = `${data.mother.id}`;

      // Assign the schedules if they exist
      if (this.child.schedules) {
        console.log('Schedules found:', this.child.schedules);
      } else {
        console.log('No schedules found for this child.');
      }

      this.child.vaccinations.sort((a, b) => {
        return (
          new Date(b.dateOfVaccination).getTime() -
          new Date(a.dateOfVaccination).getTime()
        );
      });

      this.cdr.detectChanges(); // Detect changes if necessary
    });
  }

  // Pagination
  itemsPerPage = 5;
  currentPage = 1;

  get paginatedChildren() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.child.vaccinations.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  // Pop up Vaccination
  openDialog() {
    this.dialogRef.open(VaccinePopupComponent, {
      data: {
        child: this.child, // Pass the child object
        motherName: this.motherName, // Pass the mother's name
      },
    });
  }

  // // Vaccination

  getAgeInMonths(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const ageInMonths =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth());
    return ageInMonths;
  }
  // Backup
  countVaccinations(child: Child): number {
    const oneYearAndSixWeeksAfterBirth = new Date(child.dateOfBirth);
    oneYearAndSixWeeksAfterBirth.setFullYear(
      oneYearAndSixWeeksAfterBirth.getFullYear() + 1
    );
    oneYearAndSixWeeksAfterBirth.setDate(
      oneYearAndSixWeeksAfterBirth.getDate() + 42
    ); // Add 6 weeks (42 days)

    return child.vaccinations.filter((vaccine) => {
      const vaccineDate = new Date(vaccine.dateOfVaccination);
      return (
        vaccineDate >= new Date(child.dateOfBirth) &&
        vaccineDate <= oneYearAndSixWeeksAfterBirth
      );
    }).length;
  }
  getVaccinationStatus(child: Child): string {
    const requiredVaccines = 15; // Example number of vaccines required within the time frame
    const vaccinationsWithinTimeFrame = this.countVaccinations(child); // Call the function

    if (vaccinationsWithinTimeFrame >= requiredVaccines) {
      return 'Fully Vaccinated';
    } else if (vaccinationsWithinTimeFrame > 0) {
      return 'Partially Vaccinated';
    } else {
      return 'Not Vaccinated';
    }
  }

  getVaccinationPercentage(child: Child): number {
    const totalRequiredVaccines = 15; //  total
    const administeredVaccines = this.countVaccinations(child);
    return (administeredVaccines / totalRequiredVaccines) * 100;
  }

  countAEFIOccurrences(child: Child): number {
    return child.vaccinations.filter((vaccination) => vaccination.aefi).length;
  }

  // Add Child Vaccination
  openVaccinationDialog() {
    this.dialogRef.open(PopupAddVaccinationComponent, {
      data: { childId: this.child.id },
    });
  }

  // Update Vaccination record
  openUpdateDialog(vaccinationId: string) {
    this.dialogRef.open(PopupUpdateVaccinationComponent, {
      data: {
        childId: this.child.id,
        vaccinationId: vaccinationId,
      },
    });
  }
  // Add AEFI in Vaccination Record
  openAEFIDescriptionDialog(vaccinationId: any): void {
    this.dialogRef.open(PopupAddAefiComponent, {
      data: {
        vaccinationId: vaccinationId,
      },
    });
  }

  // Method to open the nutritional calculation dialog
  openNutriCalcDialog(weighingId: any) {
    console.log('Opening NutriCalc Dialog with weighingId:', weighingId);
    console.log('Dialog data:', {
      nutritionalStatusId: this.child.nutritionalStatus?._id,
      // Add other necessary fields
    });
    this.dialogRef.open(PopupUpdateNutriCalcComponent, {
      data: {
        childId: this.child.id,
        anthropometricId: this.child.anthropometricStatus, // Ensure this is set in the child object
        // weighingId: this.child.weighingHistory[0], // Ensure this is set in the child object
        weighingId: weighingId, // Ensure this is set in the child object
        nutritionalStatusId: this.child.nutritionalStatus, // Ensure this is set in the child object
        ageInMonths: this.calculateAgeInMonths(this.child.dateOfBirth),
        gender: this.child.gender,
        // Add more properties if required
      },
    });
  }

  calculateAgeInMonths(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const ageInMonths =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth());
    return ageInMonths;
  }
}

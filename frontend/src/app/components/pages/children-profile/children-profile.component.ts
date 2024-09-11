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

      this.vaccinationSchedule =
        this.childrenService.getExpectedVaccinationSchedule(
          data.child.dateOfBirth
        );

      // Sort the vaccinations after loading the child data
      this.child.vaccinations.sort((a, b) => {
        return (
          new Date(b.dateOfVaccination).getTime() -
          new Date(a.dateOfVaccination).getTime()
        );
      });

      // Sort weighingHistory by date
      this.child.weighingHistory.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      this.cdr.detectChanges(); // Detect changes if necessary
    });
  }

  calculateMissedVaccines(child: Child): number {
    const expectedVaccines =
      this.childrenService.getExpectedVaccinationSchedule(child.dateOfBirth);
    const administeredVaccines = child.vaccinations || []; // Handle if vaccinations are empty

    // Calculate the current date
    const today = new Date();

    // Filter out the expected vaccines that were not administered or were missed
    const missedVaccines = expectedVaccines.filter((expectedVaccine) => {
      // Find if this expected vaccine was administered
      const administered = administeredVaccines.some(
        (administeredVaccine) =>
          administeredVaccine.vaccineType === expectedVaccine.vaccineType &&
          administeredVaccine.doseNumber === expectedVaccine.doseNumber
      );

      // If the vaccine was not administered and the scheduled date has passed, count it as missed
      return (
        !administered && new Date(expectedVaccine.dateOfVaccination) < today
      );
    });

    // Return the number of missed vaccines
    return missedVaccines.length;
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

  // Vaccination

  getVaccinationStatus(child: Child): string {
    if (child.isFullyVaccinated) {
      return 'Fully Vaccinated';
    } else if (child.vaccinations.length > 0) {
      return 'Partially Vaccinated';
    } else {
      return 'Not Vaccinated';
    }
  }

  getAgeInMonths(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const ageInMonths =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth());
    return ageInMonths;
  }

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

  getVaccinationPercentage(child: Child): number {
    const totalRequiredVaccines = 15; //  total
    const administeredVaccines = this.countVaccinations(child);
    return (administeredVaccines / totalRequiredVaccines) * 100;
  }

  countAEFIOccurrences(child: Child): number {
    return child.vaccinations.filter(
      (vaccination) => vaccination.aefi && vaccination.aefi.occurred
    ).length;
  }
}

// calculateMissedVaccines(child: Child): number {
//   const expectedVaccines =
//     this.childrenService.getExpectedVaccinationSchedule(child.dateOfBirth);
//   const administeredVaccines = child.vaccinations || []; // Handle if no vaccines were given
//   const today = new Date();

//   const missedVaccines = expectedVaccines.filter((expectedVaccine) => {
//     // Check if this vaccine was administered
//     const administered = administeredVaccines.find(
//       (administeredVaccine) =>
//         administeredVaccine.vaccineType === expectedVaccine.vaccineType &&
//         administeredVaccine.doseNumber === expectedVaccine.doseNumber
//     );

//     const scheduledDate = new Date(expectedVaccine.dateOfVaccination);
//     const rescheduledDate = new Date(expectedVaccine.rescheduleDate); // Assume rescheduleDate exists
//     const administeredDate = administered
//       ? new Date(administered.dateOfVaccination)
//       : null;

//     // Scenario 1: Vaccine not administered and reschedule date passed
//     if (!administered) {
//       return today > rescheduledDate; // Missed if both dates passed and no vaccine given
//     }

//     // Scenario 2: Administered, but outside the scheduled and rescheduled window
//     if (
//       administeredDate &&
//       (administeredDate < scheduledDate || administeredDate > rescheduledDate)
//     ) {
//       return true; // Missed if outside the window
//     }

//     return false; // Not missed if administered within the scheduled/rescheduled range
//   });

//   return missedVaccines.length;
// }

/////*****///// */

// Weighing
// getLatestWeighing(child: Child) {
//   return child.weighingHistory.reduce((latest, entry) => {
//     return new Date(entry.date) > new Date(latest.date) ? entry : latest;
//   }, child.weighingHistory[0]);
// }

// getNutritionalStatus(latestWeighing: any): string {
//   const {
//     weightForAgeStatus,
//     heightForAgeStatus,
//     weightForLengthHeightStatus,
//   } = latestWeighing;

//   const statuses = [
//     weightForAgeStatus,
//     heightForAgeStatus,
//     weightForLengthHeightStatus,
//   ];
//   const normalCount = statuses.filter((status) => status === 'Normal').length;

//   if (normalCount === 3) {
//     return 'Normal';
//   } else if (normalCount === 1) {
//     return 'Malnourished';
//   } else {
//     return 'At risk';
//   }
// }

import { Component, inject } from '@angular/core';
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

  child!: Child;
  midwives!: { _id: string; firstName: string; lastName: string }[];

  constructor(activatedRoute: ActivatedRoute, childrenService: ChildService) {
    activatedRoute.params.subscribe((params) => {
      if (params['id'])
        childrenService
          .getChildrenById(params['id'])
          .subscribe((serverChild) => {
            this.child = serverChild;

            // sort the data on client side
            this.child.vaccinations.sort((a, b) => {
              return (
                new Date(b.dateOfVaccination).getTime() -
                new Date(a.dateOfVaccination).getTime()
              );
            });

            // Sort weighingHistory by date (from recent to old)
            this.child.weighingHistory.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
          });
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
      data: this.child,
    });
  }

  // Date sorting

  //   child.vaccinations.sort((a, b) => {
  //   return new Date(b.dateOfVaccination).getTime() - new Date(a.dateOfVaccination).getTime();
  // });

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
}

import { Component, inject } from '@angular/core';
import { ChildService } from '../../../services/child.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupScheduledVaccinationComponent } from '../../partials/popup-scheduled-vaccination/popup-scheduled-vaccination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PopupNutriCalcComponent } from '../../partials/popup-nutri-calc/popup-nutri-calc.component';
import { PopupAddAefiComponent } from '../../partials/popup-add-aefi/popup-add-aefi.component';
import { PopupMissedVaccinationComponent } from '../../partials/popup-missed-vaccination/popup-missed-vaccination.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.css',
})
export class ScheduleListComponent {
  schedules: any[] = []; // Store all child schedules here
  filteredSchedules: any[] = []; // Filtered schedules for display
  selectedFilter: string = '24h'; // Default filter

  userRole: string = '';
  private userService = inject(UserService);

  private childService = inject(ChildService);

  constructor(private dialog: MatDialog) {
    this.userService.userObservable.subscribe((user) => {
      this.userRole = user.role;
    });
  }
  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.childService.getAllSchedules().subscribe(
      (response: any) => {
        this.schedules = response.children.flatMap((child: any) =>
          child.schedules.map((schedule: any) => {
            return {
              id: schedule._id,
              number: child._id,
              name: `${child.firstName} ${child.lastName}`,
              scheduleDate: new Date(schedule.scheduleDate),
              scheduleType: schedule.scheduleType,
              vaccineName: schedule.vaccineName,
              rescheduleDate: schedule.rescheduleDate,
              doseNumber: schedule.doseNumber,
              location: schedule.location,
              smsContent: schedule.notificationContent,
              notificationStatus: schedule.notificationSent,
              type: schedule.scheduleType,
              status: schedule.status,
              // Include latest weight and height if available
              // weight: latestWeighing ? latestWeighing.weight : null,
              // height: latestWeighing ? latestWeighing.height : null,
              ageInMonths: this.calculateAgeInMonths(child.dateOfBirth),
              gender: child.gender,
            };
          })
        );
        this.filterSchedules(); // Apply the initial filter
      },
      (error: any) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }

  calculateAgeInMonths(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const ageInMonths =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth());
    return ageInMonths;
  }

  // TODO: Schedule List start
  formatDateToYyyyMmDd(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits
    const day = ('0' + date.getDate()).slice(-2); // Ensure two digits
    return `${year}-${month}-${day}`;
  }

  filterSchedules(): void {
    const today = new Date();
    // today.setDate(today.getDate() + 5);
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparisons
    // today.setHours(today.getHours() + 12); // Adds 12 hours

    this.filteredSchedules = this.schedules
      .filter((schedule) => {
        const scheduleDate = new Date(schedule.scheduleDate);
        scheduleDate.setHours(0, 0, 0, 0); // Ensure we're comparing only dates (no time)

        const differenceInMs = today.getTime() - scheduleDate.getTime(); // Difference in milliseconds
        const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24); // Convert to days

        // Ensure we're looking only at schedules within the selected filter period
        switch (this.selectedFilter) {
          case '24h':
            return differenceInDays <= 1 && differenceInMs >= 0; // Last 24 hours
          case '1w':
            return differenceInDays <= 7 && differenceInMs >= 0; // Last 1 week
          case '2w':
            return differenceInDays <= 14 && differenceInMs >= 0; // Last 2 weeks
          case '1m':
            return differenceInDays <= 30 && differenceInMs >= 0; // Last 1 month
          case '6m':
            return differenceInDays <= 182 && differenceInMs >= 0; // Last 6 months
          case '1y':
            return differenceInDays <= 365 && differenceInMs >= 0; // Last 1 year
          default:
            return false; // Default to no filtering if no valid filter is selected
        }
      })
      .sort(
        (a, b) =>
          new Date(b.scheduleDate).getTime() -
          new Date(a.scheduleDate).getTime()
      ); // Sort in descending order by date

    console.log('Filtered Schedules:', this.filteredSchedules);
  }

  // TODO: Schedule List end

  // performAction(schedule: any): void {
  //   if (schedule.scheduleType === 'vaccination') {
  //     this.openScheduledVaccinationDialog(schedule);
  //   } else if (schedule.scheduleType === 'weighing') {
  //     this.openNutritionalStatusDialog(schedule);
  //   } else {
  //     console.log('Unknown schedule type:', schedule.scheduleType);
  //   }
  // }
  performAction(schedule: any): void {
    const today = new Date();

    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date-only comparison

    if (schedule.scheduleType === 'weighing' && !schedule.status) {
      // Update the status to true and make button unclickable for weighing
      this.openNutritionalStatusDialog(schedule);
      this.childService
        .updateScheduleStatus(schedule.id, { status: true })
        .subscribe({
          next: () => {
            schedule.status = 'Sent';
          },
          error: (error: any) => console.error('Error updating status:', error),
        });
    } else if (schedule.scheduleType === 'vaccination') {
      // Check if the schedule is missed

      const scheduleDate = new Date(schedule.scheduleDate);
      const rescheduleDate = schedule.rescheduleDate
        ? new Date(schedule.rescheduleDate)
        : null;

      if (
        !schedule.status &&
        today > scheduleDate &&
        (!rescheduleDate || (rescheduleDate && today > rescheduleDate))
      ) {
        // Open missed vaccine popup TODO:
        this.openMissedVaccinationDialog(schedule);
        // console.log(
        //   `Missed Vaccine Here - schedule date: ${scheduleDate}, reschedule date: ${rescheduleDate}`
        // );
      } else {
        // Open vaccination dialog

        this.openScheduledVaccinationDialog(schedule);
      }
    } else {
      console.log('Unknown schedule type:', schedule.scheduleType);
    }
  }

  // Add AEFI in Vaccination Record
  // openAEFIDescriptionDialog(vaccinationId: any): void {
  //   this.dialogRef.open(PopupAddAefiComponent, {
  //     data: {
  //       vaccinationId: vaccinationId,
  //     },
  //   });
  // }
  // TODO:
  openMissedVaccinationDialog(schedule: any): void {
    const dialogRef = this.dialog.open(PopupMissedVaccinationComponent, {
      data: {
        childId: schedule.number,
        vaccineType: schedule.vaccineName,
        dateOfVaccination: schedule.rescheduleDate,
      },
    });
    // TODO:
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     // Update the schedule status to true
    //     schedule.status = true;
    //     // schedule.buttonDisabled = true; /// Optional: Use this flag to manage button state
    //   }
    // });
  }

  openNutritionalStatusDialog(schedule: any): void {
    const dialogRef = this.dialog.open(PopupNutriCalcComponent, {
      data: {
        childId: schedule.number,
        ageInMonths: schedule.ageInMonths,
        // weight: schedule.weight,
        // height: schedule.height,
        gender: schedule.gender,
      },
    });
  }

  openScheduledVaccinationDialog(schedule: any): void {
    const dialogRef = this.dialog.open(PopupScheduledVaccinationComponent, {
      data: {
        childId: schedule.number,
        vaccineType: schedule.vaccineName,
        doseNumber: schedule.doseNumber,
        dateOfVaccination: schedule.scheduleDate,
        placeOfVaccination: schedule.location,
      },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     console.log('Scheduled vaccination confirmed');
    //   }
    // });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Assuming 'confirm' is returned when the user confirms vaccination
        // Update the status to true
        this.childService
          .updateScheduleStatus(schedule.id, { status: true })
          .subscribe({
            next: () => {
              schedule.status = true; // Update status in the UI
              console.log('Vaccination confirmed and status updated');
            },
            error: (error: any) =>
              console.error('Error updating vaccination status:', error),
          });
      }
    });
  }
}

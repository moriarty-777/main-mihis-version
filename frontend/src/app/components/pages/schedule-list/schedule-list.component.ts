import { Component, inject } from '@angular/core';
import { ChildService } from '../../../services/child.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupScheduledVaccinationComponent } from '../../partials/popup-scheduled-vaccination/popup-scheduled-vaccination.component';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.css',
})
export class ScheduleListComponent {
  schedules: any[] = []; // Store all child schedules here

  private childService = inject(ChildService);

  constructor(private dialog: MatDialog) {}
  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.childService.getAllSchedules().subscribe(
      (response: any) => {
        // Flatten schedules array for easier stable rendering
        this.schedules = response.children.flatMap((child: any) =>
          child.schedules.map((schedule: any) => ({
            number: child._id, // Use child ID or a generated count
            name: `${child.firstName} ${child.lastName}`,
            scheduleDate: schedule.scheduleDate,
            scheduleType: schedule.scheduleType,
            vaccineName: schedule.vaccineName,
            doseNumber: schedule.doseNumber,
            location: schedule.location,
            smsContent: schedule.notificationContent,
            status: schedule.notificationSent ? 'Sent' : 'Pending',
            type: schedule.scheduleType,
          }))
        );
      },
      (error: any) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }

  // performAction(schedule: any): void {
  //   if (schedule.scheduleType === 'weighing') {
  //     console.log('weighing here');
  //   } else if (schedule.scheduleType === 'vaccination') {
  //     console.log('vaccination here');
  //   }
  //   // else {
  //   //   console.log('Unknown schedule type:', schedule.scheduleType);
  //   // }

  //   console.log(
  //     'Action clicked for:',
  //     schedule.scheduleType,
  //     schedule.vaccineName,
  //     schedule.doseNumber
  //   );

  //   // Implement any other desired action here, e.g., open a modal, navigate, etc.
  // }

  performAction(schedule: any): void {
    if (schedule.scheduleType === 'vaccination') {
      this.openScheduledVaccinationDialog(schedule);
    } else if (schedule.scheduleType === 'weighing') {
      console.log('weighing here');
    } else {
      console.log('Unknown schedule type:', schedule.scheduleType);
    }
  }

  openScheduledVaccinationDialog(schedule: any): void {
    const today = new Date().toISOString().split('T')[0];

    const dialogRef = this.dialog.open(PopupScheduledVaccinationComponent, {
      data: {
        childId: schedule.number,
        vaccineType: schedule.vaccineName,
        doseNumber: schedule.doseNumber,
        dateOfVaccination: today,
        placeOfVaccination: schedule.location,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Scheduled vaccination confirmed');
      }
    });
  }
}

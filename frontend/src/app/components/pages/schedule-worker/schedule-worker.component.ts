import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-worker',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './schedule-worker.component.html',
  styleUrl: './schedule-worker.component.css',
})
export class ScheduleWorkerComponent {
  private userService = inject(UserService);

  // Days of the week
  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Index of the selected day (starts with Monday)
  selectedDay = 0;

  // List of users (14 BHWs)
  user: User[] = [];

  // Predefined schedule (2 BHWs per day)
  bhwSchedule: {
    firstName: string;
    lastName: string;
    id: string;
    shift: string;
  }[][] = [];

  constructor() {
    this.userService.getAll().subscribe((users) => {
      // Filter users to include only BHWs (exclude admins and midwives)
      const bhws = users.filter(
        (user) => user.role && user.role.toLowerCase() === 'bhw'
      );

      // Assigning 2 BHWs per day from the filtered BHW list
      // Ensure there are enough BHWs (14) to fill the schedule
      for (let i = 0; i < this.days.length && i * 2 + 1 < bhws.length; i++) {
        this.bhwSchedule[i] = [
          {
            firstName: bhws[i * 2].firstName,
            lastName: bhws[i * 2].lastName,
            id: bhws[i * 2].id,
            shift: '8:00am - 12:00pm',
          },
          {
            firstName: bhws[i * 2 + 1].firstName,
            lastName: bhws[i * 2 + 1].lastName,
            id: bhws[i * 2 + 1].id,
            shift: '1:00pm - 5:00pm',
          },
        ];
      }
    });
  }

  // Function to select the day
  selectDay(index: number) {
    this.selectedDay = index;
  }
}

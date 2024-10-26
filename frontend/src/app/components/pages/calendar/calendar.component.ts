import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ChildService } from '../../../services/child.service';
import interactionPlugin from '@fullcalendar/interaction'; // To handle user interactions like dateClick
import { RouterLink, RouterOutlet } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterOutlet, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  public calendarEvents: any[] = [];
  public calendarOptions!: CalendarOptions;

  constructor(private childService: ChildService) {
    console.log('Calendar component initialized');
    this.loadAllSchedules(); // Moved this inside consstructor to ensure schedules are fetched early.
    this.initializeCalendarOptions(); // Initialize calendar after API is done.
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: this.calendarEvents, // Events are loaded dynamically
      dateClick: this.handleDateClick.bind(this),
    };
  }

  loadAllSchedules(): void {
    this.childService.getAllSchedules().subscribe(
      (response: any) => {
        console.log('API Response:', response); // Add this line to check the data

        // Iterate over each child and their schedules
        response.children.forEach((child: any) => {
          child.schedules.forEach((schedule: any) => {
            this.calendarEvents.push({
              title:
                schedule.scheduleType === 'weighing'
                  ? 'OPT'
                  : schedule.vaccineName, // Check schedule type
              start: new Date(schedule.scheduleDate).toISOString(), // Make sure the dates are valid
              end: new Date(schedule.scheduleDate).toISOString(),
              allDay: true,
              description: `${schedule.remarks} (Child: ${child.firstName} ${child.lastName})`,
            });
          });
        });

        // After loading schedules, reassign events to calendar options
        this.calendarOptions.events = [...this.calendarEvents]; // Update calendar events
      },
      (error: any) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }

  handleDateClick(arg: any): void {
    console.log('Date clicked:', arg.dateStr);
  }
}

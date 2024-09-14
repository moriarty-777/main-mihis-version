import { Component } from '@angular/core';
import { AdminLogsComponent } from '../admin-logs/admin-logs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminLogsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}

import { CommonModule } from '@angular/common';
import { UserService } from './../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'admin-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-logs.component.html',
  styleUrl: './admin-logs.component.css',
})
export class AdminLogsComponent implements OnInit {
  logs: any[] = [];
  private http = inject(HttpClient);
  private userService = inject(UserService);

  constructor() {}

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {
    this.userService.getLogs().subscribe((data: any[]) => {
      this.logs = data;
    });
  }
}

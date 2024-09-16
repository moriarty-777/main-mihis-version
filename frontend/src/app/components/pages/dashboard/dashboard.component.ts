import { Component, inject } from '@angular/core';
import { AdminLogsComponent } from '../admin-logs/admin-logs.component';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private userService = inject(UserService);
  user!: User;

  constructor() {}

  ngOnInit() {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }
}

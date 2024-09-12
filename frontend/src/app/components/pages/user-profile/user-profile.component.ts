import { Component, inject } from '@angular/core';
import { User } from '../../../shared/models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  user!: User;
  yearsOfService!: string; // Property to store years and months of service
  totalMonthsOfService!: number; // Property to store total months of service
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'])
        this.userService.getUserById(params['id']).subscribe((serverUser) => {
          this.user = serverUser;
          // Calculate years and months of service after user data is loaded
          if (this.user.dateOfService) {
            this.yearsOfService = this.calculateYearsAndMonths(
              this.user.dateOfService
            );
            this.totalMonthsOfService = this.calculateTotalMonths(
              this.user.dateOfService
            );
          }
        });
    });
  }

  calculateYearsAndMonths(dateOfService: string): string {
    const serviceDate = new Date(dateOfService);
    const today = new Date();

    let years = today.getFullYear() - serviceDate.getFullYear();
    let months = today.getMonth() - serviceDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years, ${months} months`;
  }

  calculateTotalMonths(dateOfService: string): number {
    const serviceDate = new Date(dateOfService);
    const today = new Date();
    let years = today.getFullYear() - serviceDate.getFullYear();
    let months = today.getMonth() - serviceDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return years * 12 + months;
  }
}

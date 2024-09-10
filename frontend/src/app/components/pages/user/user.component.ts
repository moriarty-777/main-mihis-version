import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../../../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { MotherService } from '../../../services/mother.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  user: User[] = [];
  // private http = inject(HttpClient);
  private userService = inject(UserService);
  constructor() {
    /* this.userService.getAll().subscribe((users) => {
      this.user = users;
    }); */
    // this.userService.getAll().subscribe((users) => {
    //   // Filter out Admin users and calculate years and months of service
    //   this.user = users
    //     .filter((user) => user.role && user.role.toLowerCase() !== 'admin')
    //     .map((user) => ({
    //       ...user,
    //       yearsOfService: this.calculateYearsAndMonths(user.dateOfService),
    //     }));
    // });

    this.userService.getAll().subscribe((users) => {
      this.user = users
        .filter((user) => user.role && user.role.toLowerCase() !== 'admin')
        .map((user) => ({
          ...user,
          yearsOfService: this.calculateYearsAndMonths(user.dateOfService),
          totalMonthsOfService: this.calculateTotalMonths(user.dateOfService),
        }))
        .sort((a, b) => {
          if (a.role.toLowerCase() === 'midwife') return -1;
          if (b.role.toLowerCase() === 'midwife') return 1;
          return b.totalMonthsOfService - a.totalMonthsOfService;
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

  // search(searchTerm: string) {
  //   this.motherService
  //     .getAllMotherBySearchTerm(searchTerm)
  //     .subscribe((mothers) => {
  //       this.mother = mothers;
  //     });
  // }
}

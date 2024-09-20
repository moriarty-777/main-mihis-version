import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../../../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { MotherService } from '../../../services/mother.service';
import { UserService } from '../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupUserComponent } from '../../partials/popup-user/popup-user.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  user: User[] = [];
  private dialogRef = inject(MatDialog);
  private toastrService = inject(ToastrService);
  // private http = inject(HttpClient);
  private userService = inject(UserService);
  roleFilter: string = '';
  experienceFilter: string = '';

  constructor() {
    this.loadUsers();
    // this.userService.getAll().subscribe((users) => {
    //   this.user = users
    //     .filter((user) => user.role && user.role.toLowerCase() !== 'admin')
    //     .map((user) => ({
    //       ...user,
    //       yearsOfService: this.calculateYearsAndMonths(user.dateOfService),
    //       totalMonthsOfService: this.calculateTotalMonths(user.dateOfService),
    //     }))
    //     .sort((a, b) => {
    //       if (a.role.toLowerCase() === 'midwife') return -1;
    //       if (b.role.toLowerCase() === 'midwife') return 1;
    //       return b.totalMonthsOfService - a.totalMonthsOfService;
    //     });
    // });
  }

  // Load users with filters applied
  loadUsers() {
    this.userService.getAll().subscribe((users) => {
      this.user = users
        .filter(
          (user) =>
            user.role &&
            (user.role.toLowerCase() !== 'admin' ||
              user.role.toLowerCase() === 'pending')
        ) // Hide admins
        .filter((user) => this.applyRoleFilter(user)) // Apply role filter
        .filter((user) => this.applyExperienceFilter(user)) // Apply experience filter
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

  // Filter by role
  applyRoleFilter(user: User) {
    if (!this.roleFilter) return true; // No role filter applied
    return user.role.toLowerCase() === this.roleFilter.toLowerCase();
  }

  // Filter by years of experience
  applyExperienceFilter(user: User) {
    const totalMonths = this.calculateTotalMonths(user.dateOfService);
    if (this.experienceFilter === 'lessThan1') {
      return totalMonths < 12; // Less than 1 year
    }
    if (this.experienceFilter === 'lessThan5') {
      return totalMonths > 12 && totalMonths < 120;
    }
    if (this.experienceFilter === 'moreThan10') {
      return totalMonths > 120; // More than 10 years
    }
    return true; // No experience filter applied
  }

  // Handle role change event
  onRoleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.roleFilter = selectElement.value;
    this.loadUsers(); // Reload users after applying the role filter
  }

  // Handle experience change event
  onExperienceChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.experienceFilter = selectElement.value;
    this.loadUsers(); // Reload users after applying the experience filter
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

  // update() {}
  deleteUser(userId: string): void {
    // Show a warning Toastr
    this.toastrService.warning(
      'Please confirm your action!',
      'Delete Confirmation',
      {
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-bottom-right',
      }
    );

    // Use a native confirm dialog after Toastr
    setTimeout(() => {
      const userConfirmed = confirm(
        'Are you sure you want to delete this user?'
      );

      if (userConfirmed) {
        // Proceed with deletion
        this.userService.deleteUser(userId).subscribe(
          (response) => {
            this.toastrService.success('User deleted successfully!');
            window.location.reload(); // Reload after successful deletion
          },
          (error) => {
            this.toastrService.error('Error deleting user');
          }
        );
      }
    }, 500); // Allow the Toastr to appear before showing confirm dialog
  } //

  openDialog(userId: string) {
    this.dialogRef.open(PopupUserComponent, {
      data: { userId }, // Passing user object to the dialog
    });
  }
  // search(searchTerm: string) {
  //   this.userService.getAllUserBySearchTerm(searchTerm).subscribe((users) => {
  //     this.user = users;
  //   });
  // }

  search(searchTerm: string) {
    this.userService.getAllUserBySearchTerm(searchTerm).subscribe((users) => {
      this.user = users
        .filter((user) => user.role && user.role.toLowerCase() !== 'admin') // Apply the admin filter again if needed
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
}

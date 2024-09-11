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
    // Show a confirmation Toastr
    // const toastrRef = this.toastrService.warning(
    //   'Are you sure you want to delete this user?',
    //   'Delete Confirmation',
    //   {
    //     timeOut: 5000, // Automatically close after 5 seconds
    //     tapToDismiss: true,
    //     closeButton: true,
    //     progressBar: true,
    //     positionClass: 'toast-bottom-right',
    //   }
    // );

    // // Perform the delete operation if the toastr is dismissed by timeout or close button
    // toastrRef.onHidden.subscribe(() => {
    //   if (confirm('Do you want to delete this user?')) {
    //     // Proceed with deletion
    //     this.userService.deleteUser(userId).subscribe(
    //       (response) => {
    //         this.toastrService.success('User deleted successfully!');
    //         window.location.reload(); // Reload the page after successful deletion
    //       },
    //       (error) => {
    //         this.toastrService.error('Error deleting user');
    //       }
    //     );
    //   }
    // }); adas asd asd ad asdsa TODO:

    // if (confirm('Are you sure you want to delete this user?')) {
    //   this.userService.deleteUser(userId).subscribe(
    //     (response) => {
    //       console.log('User deleted successfully!', response);
    //       window.location.reload(); // Reload the page or refresh the list
    //     },
    //     (error) => {
    //       console.error('Error deleting user', error);
    //     }
    //   );
    // }
  } //

  openDialog(userId: string) {
    this.dialogRef.open(PopupUserComponent, {
      data: { userId }, // Passing user object to the dialog
    });
  }
  // search(searchTerm: string) {
  //   this.motherService
  //     .getAllMotherBySearchTerm(searchTerm)
  //     .subscribe((mothers) => {
  //       this.mother = mothers;
  //     });
  // }
}

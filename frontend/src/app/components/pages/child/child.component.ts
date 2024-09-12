import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Child } from '../../../shared/models/child';
import { ChildService } from '../../../services/child.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PopupChildComponent } from '../../partials/popup-child/popup-child.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './child.component.html',
  styleUrl: './child.component.css',
})
export class ChildComponent {
  child: Child[] = [];
  private dialogRef = inject(MatDialog);
  private toastrService = inject(ToastrService);
  private childService = inject(ChildService);
  // FIXME:
  genderFilter: string = '';
  purokFilter: string = '';
  nutritionalStatusFilter: string = '';
  vaxStatusFilter: string = '';
  // FIXME:
  // public childObservable: Observable<Child[]>;
  constructor() {
    // this.childObservable = this.childService.getAll();
    // this.childService.getAll().subscribe((children) => {
    //   this.child = children;
    // });
    // FIXME: New Data
    this.loadChildren();
    // FIXME: New Data
  }

  resetFilters() {
    this.genderFilter = '';
    this.purokFilter = '';
    this.nutritionalStatusFilter = '';
    this.vaxStatusFilter = '';
    this.loadChildren(); // Reload all children without any filters
  }

  //   // FIXME: New Data FILTERS
  // Load children based on the selected filters
  loadChildren() {
    const filters = {
      gender: this.genderFilter,
      purok: this.purokFilter,
      nutritionalStatus: this.nutritionalStatusFilter,
      vaxStatus: this.vaxStatusFilter,
    };

    // Fetch filtered children from the backend
    this.childService.getAll(filters).subscribe((children) => {
      this.child = children;
      // console.log('Filtered children:', this.child);
    });
  }

  // Handle change events for dropdown filters
  onGenderChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.genderFilter = selectElement.value;
    this.loadChildren();
  }

  onPurokChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.purokFilter = selectElement.value;
    this.loadChildren();
  }

  onNutritionalStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.nutritionalStatusFilter = selectElement.value;
    this.loadChildren();
  }

  onVaxStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.vaxStatusFilter = selectElement.value;
    this.loadChildren();
  }
  //   // FIXME: New Data

  search(searchTerm: string) {
    this.childService
      .getAllChildrenBySearchTerm(searchTerm)
      .subscribe((children) => {
        this.child = children;
      });
  }

  deleteChild(childId: string): void {
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
      const childConfirmed = confirm(
        'Are you sure you want to delete this child?'
      );

      if (childConfirmed) {
        // Proceed with deletion
        this.childService.deleteChild(childId).subscribe(
          (response) => {
            this.toastrService.success('Child deleted successfully!');
            window.location.reload(); // Reload after successful deletion
          },
          (error) => {
            this.toastrService.error('Error deleting Child');
          }
        );
      }
    }, 500);
  }

  // openDialog(childId: string) {
  //   this.dialogRef.open(PopupChildComponent, {
  //     data: { childId }, // Passing user object to the dialog
  //   });
  // }

  openDialog(childId: string) {
    this.dialogRef.open(PopupChildComponent, {
      data: { childId: childId }, // Ensure correct data is passed here
    });
  }
}
//   search(searchTerm: string) {
//   this.childService.getAllChildrenBySearchTerm(searchTerm).subscribe((children) => {
//     this.child = children;
//   });
// }

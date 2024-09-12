import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MotherService } from '../../../services/mother.service';
import { Mother } from '../../../shared/models/mother';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PopupMotherComponent } from '../../partials/popup-mother/popup-mother.component';

@Component({
  selector: 'app-mothers',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './mothers.component.html',
  styleUrl: './mothers.component.css',
})
export class MothersComponent {
  mother: Mother[] = [];
  private http = inject(HttpClient);
  private motherService = inject(MotherService);
  private dialogRef = inject(MatDialog);
  private toastrService = inject(ToastrService);
  purokFilter: string = '';
  childrenCountFilter: string = '';
  transientFilter: string = '';

  constructor() {
    // this.motherService.getAll().subscribe((mothers) => {
    //   this.mother = mothers;
    // });

    this.loadMothers();
  }

  loadMothers() {
    const filters = {
      purok: this.purokFilter,
      childrenCount: this.childrenCountFilter,
      isTransient: this.transientFilter,
    };

    this.motherService.getAll(filters).subscribe((mothers) => {
      this.mother = mothers;
    });
  }

  resetFilters() {
    this.purokFilter = '';
    this.childrenCountFilter = '';
    this.transientFilter = '';
    this.loadMothers(); // Reload all mothers without any filters
  }
  // Filter change methods
  onPurokChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.purokFilter = selectElement.value;
    this.loadMothers();
  }

  onChildrenCountChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.childrenCountFilter = selectElement.value;
    this.loadMothers();
  }

  onTransientChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.transientFilter = selectElement.value;
    this.loadMothers();
  }

  search(searchTerm: string) {
    this.motherService
      .getAllMotherBySearchTerm(searchTerm)
      .subscribe((mothers) => {
        this.mother = mothers;
      });
  }
  openDialog(motherId: string) {
    this.dialogRef.open(PopupMotherComponent, {
      data: { motherId: motherId }, // Ensure correct data is passed here
    });
  }

  deleteMother(motherId: string): void {
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
      const motherConfirmed = confirm(
        'Are you sure you want to delete this mother?'
      );

      if (motherConfirmed) {
        // Proceed with deletion
        this.motherService.deleteMother(motherId).subscribe(
          (response) => {
            this.toastrService.success('Mother deleted successfully!');
            window.location.reload(); // Reload after successful deletion
          },
          (error) => {
            this.toastrService.error('Error deleting Mother');
          }
        );
      }
    }, 500);
  }
} //

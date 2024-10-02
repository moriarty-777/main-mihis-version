import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChildService } from '../../../services/child.service';
import { Child } from '../../../shared/models/child';

@Component({
  selector: 'reports',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  child: Child[] = [];
  private dialogRef = inject(MatDialog);
  private toastrService = inject(ToastrService);
  private childService = inject(ChildService);
  genderFilter: string = '';
  purokFilter: string = '';
  nutritionalStatusFilter: string = '';

  heightForAgeFilter: string = '';
  weightForAgeFilter: string = '';
  weightForLengthFilter: string = '';

  // FIXME: start
  // sample_data: any;
  sample_data: any[] = [
    { indicator: 'CPAB', male: 0, female: 1, total: 1 },
    { indicator: 'BCG', male: 0, female: 0, total: 0 },
    { indicator: 'HepB, within 24 hours', male: 0, female: 0, total: 0 },
    { indicator: 'DPT-HiB-HepB 1', male: 0, female: 1, total: 1 },
    { indicator: 'DPT-HiB-HepB 2', male: 2, female: 2, total: 4 },
    { indicator: 'DPT-HiB-HepB 3', male: 1, female: 3, total: 4 },
    { indicator: 'OPV 1', male: 0, female: 1, total: 1 },
    { indicator: 'OPV 2', male: 2, female: 2, total: 4 },
    { indicator: 'OPV 3', male: 1, female: 3, total: 4 },
    { indicator: 'IPV 2 (routine)', male: 0, female: 2, total: 2 },
    { indicator: 'IPV 2 (catch-up)', male: 0, female: 2, total: 2 },
    //
    { indicator: 'PCV 1', male: 0, female: 1, total: 1 },
    { indicator: 'PCV 2', male: 2, female: 2, total: 4 },
    { indicator: 'PCV 3', male: 1, female: 3, total: 4 },
    { indicator: 'MCV 1', male: 1, female: 0, total: 1 },
    { indicator: 'MCV 2', male: 1, female: 1, total: 2 },
    { indicator: 'FIC', male: 1, female: 0, total: 1 },
    { indicator: 'CIC', male: 1, female: 0, total: 1 },
    //
    { indicator: 'Td, Grade 1 (October)', male: 0, female: 0, total: 0 },
    { indicator: 'MR, Grade 1 (October)', male: 0, female: 0, total: 0 },
    { indicator: 'Td, Grade 7 (October)', male: 0, female: 0, total: 0 },
    { indicator: 'MR, Grade 7 (October)', male: 0, female: 0, total: 0 },
  ];

  showVaccinationReports: boolean = true;

  toggleReports(reportType: string) {
    if (reportType === 'vaccination') {
      this.showVaccinationReports = true;
    } else if (reportType === 'nutrition') {
      this.showVaccinationReports = false;
    }
  }
  // FIXME: end

  constructor() {
    this.loadChildren();
  }

  loadChildren() {
    const filters = {
      gender: this.genderFilter,
      purok: this.purokFilter,
      nutritionalStatus: this.nutritionalStatusFilter,
      heightForAge: this.heightForAgeFilter,
      weightForAge: this.weightForAgeFilter,
      weightForLength: this.weightForLengthFilter,
    };

    this.childService.getAll(filters).subscribe((children) => {
      // FIXME: start

      // FIXME: end

      this.child = children;

      // FIXME: start

      // FIXME: end
    });
  }

  // FIXME: start

  // FIXME: end

  resetFilters() {
    this.genderFilter = '';
    this.purokFilter = '';
    this.nutritionalStatusFilter = '';
    this.heightForAgeFilter = '';
    this.weightForAgeFilter = '';
    this.weightForLengthFilter = '';
    this.loadChildren(); // Reload all children without any filters
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

  onHeightForAgeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.heightForAgeFilter = selectElement.value;
    this.loadChildren();
  }

  onWeightForAgeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.weightForAgeFilter = selectElement.value;
    this.loadChildren();
  }

  onWeightForLengthChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.weightForLengthFilter = selectElement.value;
    this.loadChildren();
  }

  search(searchTerm: string) {
    this.childService
      .getAllChildrenBySearchTerm(searchTerm)
      .subscribe((children) => {
        this.child = children;
      });
  }
}

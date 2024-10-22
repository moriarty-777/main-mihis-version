import { Component, inject } from '@angular/core';
import { Mother } from '../../../shared/models/mother';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MotherService } from '../../../services/mother.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupAddChildComponent } from '../../partials/popup-add-child/popup-add-child.component';

@Component({
  selector: 'app-mother-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './mother-profile.component.html',
  styleUrl: './mother-profile.component.css',
})
export class MotherProfileComponent {
  mother!: Mother;
  private activatedRoute = inject(ActivatedRoute);
  private motherService = inject(MotherService);
  private dialogRef = inject(MatDialog);
  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'])
        this.motherService
          .getMotherById(params['id'])
          .subscribe((serverMother) => {
            this.mother = serverMother;
          });
    });
  } //

  getVaccinationStatus(child: any): string {
    if (child.isFullyVaccinated) {
      return 'Fully Vaccinated';
    } else if (child.vaccinations.length > 0) {
      return 'Partially Vaccinated';
    } else {
      return 'Not Vaccinated';
    }
  }

  getAgeInMonths(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const ageInMonths =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth());
    return ageInMonths;
  }

  openDialog() {
    this.dialogRef.open(PopupAddChildComponent, {
      data: { motherId: this.mother.id }, /// Ensure correct data is passed here
    });
  }
  // linkChild() {
  //   const motherId = '67103e8dbd8e366d0c92b278'; // From form or selected data
  //   const childId = '67103e66b3bf97ca89f10a5c'; // From form or selected data

  //   this.motherService
  //     .linkChildToMother(motherId, childId)
  //     .subscribe((response) => {
  //       console.log(response);
  //       // Optionally reload or refresh the page
  //     });

  //   // Link Id
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 3000);
  // }
}

import { Component, inject } from '@angular/core';
import { Mother } from '../../../shared/models/mother';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MotherService } from '../../../services/mother.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mother-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mother-profile.component.html',
  styleUrl: './mother-profile.component.css',
})
export class MotherProfileComponent {
  mother!: Mother;
  private activatedRoute = inject(ActivatedRoute);
  private motherService = inject(MotherService);
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
}

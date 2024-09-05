import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MotherService } from '../../../services/mother.service';
import { Mother } from '../../../shared/models/mother';

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
  private momtherService = inject(MotherService);
  constructor() {
    this.momtherService.getAll().subscribe((mothers) => {
      this.mother = mothers;
    });
  }

  search(searchTerm: string) {
    this.momtherService
      .getAllMotherBySearchTerm(searchTerm)
      .subscribe((mothers) => {
        this.mother = mothers;
      });
  }
}

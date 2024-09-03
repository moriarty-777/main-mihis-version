import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Child } from '../../../shared/models/child';
import { ChildService } from '../../../services/child.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './child.component.html',
  styleUrl: './child.component.css',
})
export class ChildComponent {
  child: Child[] = [];
  private childService = inject(ChildService);
  // public childObservable: Observable<Child[]>;
  constructor() {
    // this.childObservable = this.childService.getAll();
    this.childService.getAll().subscribe((children) => {
      this.child = children;
    });
  }

  search(searchTerm: string) {
    this.childService
      .getAllChildrenBySearchTerm(searchTerm)
      .subscribe((children) => {
        this.child = children;
      });
  }

  //   search(searchTerm: string) {
  //   this.childService.getAllChildrenBySearchTerm(searchTerm).subscribe((children) => {
  //     this.child = children;
  //   });
  // }
}

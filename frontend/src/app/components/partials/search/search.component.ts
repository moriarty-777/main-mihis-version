import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchTerm = '';
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['searchTerm']) this.searchTerm = params['searchTerm'];
    });
  }
  search(term: string): void {
    if (term) this.router.navigateByUrl('/search/' + term);
  }
}

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'footer',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear: number;
  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}

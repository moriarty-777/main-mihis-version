import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-pending',
  standalone: true,
  imports: [],
  templateUrl: './role-pending.component.html',
  styleUrl: './role-pending.component.css',
})
export class RolePendingComponent {
  private router = inject(Router);
  navigateToSignup() {
    this.router.navigateByUrl('/');
  }
}

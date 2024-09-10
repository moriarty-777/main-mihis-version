import { Component, inject } from '@angular/core';
import { User } from '../../../shared/models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  user!: User;
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'])
        this.userService.getUserById(params['id']).subscribe((serverUser) => {
          this.user = serverUser;
        });
    });
  }
}

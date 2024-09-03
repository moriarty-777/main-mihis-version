import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'main-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  user!: User;

  constructor() {}

  ngOnInit() {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    // return this.user.token;
    return !!this.user.token;
  }
}

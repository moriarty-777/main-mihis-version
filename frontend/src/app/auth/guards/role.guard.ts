import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const currentUser = userService.currentUser;

  // Check if user role is admin
  if (currentUser.role === 'admin') {
    return true;
  } else {
    router.navigate(['/']); // Redirect to home or some other page
    return false;
  }
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

// export const roleGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const userService = inject(UserService);

//   const currentUser = userService.currentUser;

//   // Check if user role is admin
//   if (currentUser.role === 'admin') {
//     return true;
//   } else {
//     router.navigate(['/']); // Redirect to home or some other page
//     return false;
//   }
// };

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const currentUser = userService.currentUser;
  const userRole = currentUser.role;

  // Define allowed roles for each route here
  const allowedRoles = route.data?.['roles'] as Array<string>;

  if (userRole === 'bhw' && state.url === '/dashboard') {
    // Redirect BHW to /dashboard/schedule
    console.log('BHW detected, redirecting to /dashboard/calendar');
    router.navigate(['/dashboard/calendar']);
    return true; // Prevent further navigation
  }

  if (allowedRoles && allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/']); // Redirect if unauthorized
    return false;
  }
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  if (userService.currentUser.token) return true;
  else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // This auth guard protects routes from anonymous user
  // const localData = localStorage.getItem('wesa');
  // if (localData) {
  //   return true;
  // } else {
  //   router.navigateByUrl('login');
  //   return false;
  // }
};

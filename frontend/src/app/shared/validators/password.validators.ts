import { AbstractControl } from '@angular/forms';

export class PasswordValidators {
  static passwordShouldMatch(control: AbstractControl) {
    let password = control.get('password');
    let confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value)
      return { passwordShouldMatch: true };
    return null;
  }
}

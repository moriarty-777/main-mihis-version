import { AbstractControl, ValidationErrors } from '@angular/forms';

// export class UsernameValidators {
//   static isValidEmail(control: AbstractControl): ValidationErrors | null {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (control.value && !emailRegex.test(control.value)) {
//       return { invalidEmail: true };
//     }
//     return null;
//   }

//   static isValidPhone(control: AbstractControl): ValidationErrors | null {
//     const phoneRegex = /^09\d{9}$/;
//     if (control.value && !phoneRegex.test(control.value)) {
//       return { invalidPhone: true };
//     }
//     return null;
//   }
//   //

//   static isEmailOrPhone(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     if (!value) return { required: true };

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const phoneRegex = /^\+639\d{9}$/;

//     if (!emailRegex.test(value) && !phoneRegex.test(value)) {
//       return { isEmailOrPhone: true };
//     }

//     return null;
//   }

//   static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
//     if ((control.value as string).indexOf(' ') >= 0) {
//       return { cannotContainSpace: true };
//     }

//     return null;
//   }

//   static shouldBeUnique(
//     control: AbstractControl
//   ): Promise<ValidationErrors | null> {
//     return new Promise((resolve, reject) => {
//       // setTimeout(() => {
//       //   if (control.value === 'epe') resolve({ shouldBeUnique: true });
//       //   else resolve(null);
//       // }, 2000);
//     });
//   }
// }
export class UsernameValidators {
  // Validates Email format
  static isValidEmail(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Validates Phone format and auto prepends '63' if it starts with '09'
  static isValidPhone(control: AbstractControl): ValidationErrors | null {
    let phone = control.value;

    // If phone starts with '09', replace it with '63'
    if (phone.startsWith('09')) {
      phone = '63' + phone.slice(1);
      control.setValue(phone); // Automatically update the control value to start with '63'
    }

    const phoneRegex = /^63\d{10}$/; // Phone numbers must start with '63' and have 9 digits after
    if (control.value && !phoneRegex.test(control.value)) {
      return { invalidPhone: true };
    }

    return null;
  }

  // Validates either email or phone format
  static isEmailOrPhone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phone = value;

    // Automatically change '09' prefix to '63'
    if (phone.startsWith('09')) {
      phone = '63' + phone.slice(1);
      control.setValue(phone); // Automatically update the control value to start with '63'
    }

    const phoneRegex = /^\+?63\d{10}$/; // Allow either '+63' or '63'

    // Check if it's neither a valid email nor a valid phone number
    if (!emailRegex.test(value) && !phoneRegex.test(phone)) {
      return { isEmailOrPhone: true };
    }

    return null;
  }

  // Validates if input contains spaces
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
}

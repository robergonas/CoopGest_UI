import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  newPassword: string,
  confirmPassword: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordValue = control.get(newPassword)?.value;
    const confirmPasswordValue = control.get(confirmPassword)?.value;

    if (passwordValue !== confirmPasswordValue) {
      control.get(confirmPassword)?.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else {
      control.get(confirmPassword)?.setErrors(null);
      return null;
    }
  };
}

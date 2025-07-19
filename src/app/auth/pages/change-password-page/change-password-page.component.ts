import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

import { passwordsMatchValidator } from '../../../validators/custom-validators';

@Component({
  selector: 'app-change-password-page',
  standalone: false,

  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ChangePasswordPageComponent {
  constructor(
    private dialogRef: MatDialogRef<ChangePasswordPageComponent>,
    private authService: AuthServiceService
  ) {}
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group(
    {
      userName: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmPassword') }
  );

  onChangePassword(): void {
    const { userName, password, newPassword, confirmPassword } =
      this.myForm.value;

    if (this.myForm.valid) {
      this.authService.onLogin(userName, password).subscribe((Response) => {
        if (Response.state) {
          this.authService
            .onChangePassword(userName, newPassword)
            .subscribe((response) => {
              if (response.state) {
                Swal.fire({
                  icon: 'success',
                  title: 'Contraseña actualizada!',
                  text: Response.message,
                  confirmButtonText: 'Entendido',
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: Response.message,
                  confirmButtonText: 'Entendido',
                });
              }
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: Response.message,
            confirmButtonText: 'Entendido',
          });
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}

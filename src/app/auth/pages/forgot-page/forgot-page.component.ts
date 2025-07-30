import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';

import { AuthServiceService } from '../../services/auth.service';
@Component({
  selector: 'app-forgot-page',
  standalone: false,

  templateUrl: './forgot-page.component.html',
  styleUrl: './forgot-page.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ForgotPageComponent {
  constructor(
    private dialogRef: MatDialogRef<ForgotPageComponent>,
    private authServiceService: AuthServiceService
  ) {}
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(4)]],
    email: [
      '',
      [Validators.required, Validators.minLength(15), Validators.email],
    ],
  });

  async onForgotPassword() {
    try {
      if (this.myForm.valid) {
        const { userName, email } = this.myForm.value;

        this.authServiceService
          .onForgotPassword(userName, email)
          .subscribe((response) => {
            if (response.state) {
              Swal.fire({
                icon: 'success',
                title: '¡Contraseña Enviada!',
                html: 'Hemos enviado tu nueva contraseña al correo electrónico asociado a tu cuenta. Por favor, revisa tu bandeja de entrada o carpeta de spam.',
                confirmButtonText: 'Entendido',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: response.message || 'error desconocido.',
                confirmButtonText: 'Entendido',
              });
            }
          });
      } else {
        this.myForm.markAllAsTouched();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar la nueva conatrseña', 'error');
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}

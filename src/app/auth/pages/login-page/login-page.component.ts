import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

import { ChangePasswordPageComponent } from '../change-password-page/change-password-page.component';
import { ForgotPageComponent } from '../forgot-page/forgot-page.component';
import { AuthServiceService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: false,

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private dialog: MatDialog,
    private authServiceService: AuthServiceService,
    private router: Router
  ) {}

  onLogin(): void {
    if (this.myForm.valid) {
      const { userName, password } = this.myForm.value;

      this.authServiceService
        .onLogin(userName, password)
        .subscribe((response) => {
          if (response.state) {
            localStorage.setItem('currentUser', JSON.stringify(response.list));
            this.router.navigate(['./operation/home']);
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
  }
  onForgotPassword(): void {
    this.dialog.open(ForgotPageComponent);
  }
  onChangePassword(): void {
    this.dialog.open(ChangePasswordPageComponent);
  }
}

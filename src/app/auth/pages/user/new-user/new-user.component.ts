import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Partner } from '../../../../interface/partner';
import { User } from '../../../interfaces/user.Interface';
import { OperationService } from '../../../../operation/service/operation.service';

@Component({
  selector: 'app-new-user',
  standalone: false,

  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class NewUserComponent {
  partnerList: Partner[] = [];
  myForm: FormGroup;

  constructor(
    private operationService: OperationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewUserComponent>
  ) {
    this.myForm = this.fb.group({
      idPartner: ['0', [Validators.required]],
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.onSearchPartner();
  }

  onSearchPartner(): void {
    this.operationService
      .onSearchPartner('', 0, '', 1000, 1)
      .subscribe((response) => {
        if (response.state) {
          this.partnerList = response.list || [];
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'error desconocido.',
            confirmButtonText: 'Entendido',
          });
        }
      });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  onSaveUser(): void {
    if (this.myForm.valid) {
      const { idPartner, userName, password } = this.myForm.value;
      this.operationService
        .onUserAdd(idPartner, userName, password)
        .subscribe((response) => {
          if (response.state) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: response.message || 'Usuario creado correctamente.',
              confirmButtonText: 'Entendido',
            });
            this.dialogRef.close();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response.message || 'Error desconocido.',
              confirmButtonText: 'Entendido',
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        confirmButtonText: 'Entendido',
      });
      return;
    }
  }
}

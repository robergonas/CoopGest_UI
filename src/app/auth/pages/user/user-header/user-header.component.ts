import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { NewUserComponent } from '../new-user/new-user.component';

@Component({
  selector: 'app-user-header',
  standalone: false,

  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css',
})
export class UserHeaderComponent {
  myForm: FormGroup;

  @Output() onGetUser = new EventEmitter<{ name: string; userName: string }>();

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.myForm = this.fb.group({
      name: [''],
      userName: [''],
    });
  }

  async onEnter() {
    if (this.myForm.valid) {
      const { name, userName } = this.myForm.value;
      if (name.length >= 3 || userName.length >= 3) {
        this.onGetUser.emit({ name, userName });
      } else {
        await Swal.fire({
          icon: 'info',
          title: 'Búsqueda inválida',
          text: `Debe ingresar al menos 3 caracteres de usuario o de socio para poder realizar la búsqueda.`,
          confirmButtonText: 'Entendido',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#3085d6',
          backdrop: true,
        });
      }
    } else {
      console.warn('El formulario no es válido');
    }
  }

  async onNewUser() {
    const dialogRef = this.dialog.open(NewUserComponent, {});
  }
}

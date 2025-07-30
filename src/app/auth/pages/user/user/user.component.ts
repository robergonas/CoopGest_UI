import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';

import { User } from '../../../interfaces/user.Interface';
import { OperationService } from '../../../../operation/service/operation.service';

@Component({
  selector: 'app-user',
  standalone: false,

  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class UserComponent {
  userList: User[] = [];
  constructor(private operationService: OperationService) {}

  onGetUser({ name, userName }: { name: string; userName: string }): void {
    this.operationService.onGetUser(name, userName).subscribe((response) => {
      if (response.state) {
        this.userList = response.list || [];
      } else {
        Swal.fire({
          icon: 'info',
          title: 'información',
          text: response.message || 'No se encontraron resultados',
          confirmButtonText: 'Entendido',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#d33',
          backdrop: true,
        });
      }
    });
  }

  onUserChangeStatus({ user, active }: { user: User; active: boolean }): void {
    Swal.fire({
      title: `Esta seguro de cambiar el estado de usuario paera el socio ${user.fullName}?`,
      showDenyButton: true,
      confirmButtonText: 'Si, estoy seguro.',
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService
          .onChangeUserStatus(user.idUserCreation, active)
          .subscribe((response) => {
            if (response.state) {
              Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: `El usuario ${user.fullName} ha sido ${
                  user.active ? 'habilitado' : 'deshabilitado'
                } correctamente.`,
                confirmButtonText: 'Entendido',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#3085d6',
                backdrop: true,
              });
              this.onGetUser({ name: user.fullName, userName: user.userName });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al actualizar estado',
                text:
                  response.message ||
                  'No se pudo actualizar el estado del usuario.',
                confirmButtonText: 'Entendido',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#d33',
                backdrop: true,
              });
            }
          });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Información!',
          text: 'Operación cancelada, no se actualizó ningun estado del usuario.',
          confirmButtonText: 'Entendido',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#3085d6',
          backdrop: true,
        });
        return;
      }
    });
  }
}

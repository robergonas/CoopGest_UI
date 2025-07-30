import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

import { UtilitiesService } from '../../../../functions/utilities.service';
import { OperationService } from './../../../service/operation.service';
import { Partner } from '../../../../interface/partner';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-manage-partner',
  standalone: false,

  templateUrl: './manage-partner.component.html',
  styleUrl: './manage-partner.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ManagePartnerComponent implements OnInit {
  myForm: FormGroup;
  partner?: Partner;
  savePartner: boolean = false;

  @Output() search = new EventEmitter<{
    name: string;
    documentNumber: string;
    idDocument: string;
  }>();

  constructor(
    private operationService: OperationService,
    private utilities: UtilitiesService,
    private dialogRef: MatDialogRef<ManagePartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.partner = data.partner;
    this.savePartner = data.savePartner;

    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6)]],
      idDocument: ['', [utilities.idDocumentValidator()]],
      birthDate: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    if (!this.savePartner) this.showpartner();
    else this.myForm.patchValue({ idDocument: '0' });
  }

  showpartner(): void {
    if (!this.savePartner && this.partner) {
      this.myForm.patchValue({
        name: this.partner.name || '',
        documentNumber: this.partner.documentNumber || '',
        idDocument: this.partner.idDocument || '',
        birthDate: this.utilities.dateInputFormat(this.partner.birthDate) || '',
        phoneNumber: this.partner.phoneNumber || '',
        email: this.partner.email || '',
        address: this.partner.address || '',
      });
    } else {
      console.warn(
        'No se pudo asignar los valores: this.partner no está definido o savePartner es true'
      );
    }
  }

  onDocumentTypeSelected(idDocument: string): void {
    this.myForm.patchValue({ idDocument });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSavePartner(): void {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const {
        name,
        documentNumber,
        idDocument,
        birthDate,
        phoneNumber,
        email,
        address,
      } = this.myForm.value;

      if (idDocument === '0') {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Seleccione tipo de documento',
          confirmButtonText: 'Entendido',
        });
        return;
      } else {
        this.operationService
          .onSavePartner(
            name,
            address,
            idDocument,
            documentNumber,
            email,
            phoneNumber,
            birthDate,
            1,
            constants.current_User()!.idPartner
          )
          .subscribe((response) => {
            if (response.state) {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Socio registrado',
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
      }
    }
  }

  onUpdPartner(): void {
    Swal.fire({
      title: `Esta seguro de actualizar los datos del socio?`,
      showDenyButton: true,
      confirmButtonText: 'Si, estoy seguro.',
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.myForm.valid) {
          const {
            name,
            documentNumber,
            idDocument,
            birthDate,
            phoneNumber,
            email,
            address,
          } = this.myForm.value;
          this.operationService
            .onUpdPartner(
              this.partner!.idPartner,
              name,
              address,
              idDocument,
              documentNumber,
              email,
              phoneNumber,
              birthDate,
              1,
              constants.current_User()!.idPartner
            )
            .subscribe((response) => {
              if (response.state) {
                Swal.fire({
                  icon: 'success',
                  title: 'Exito!',
                  text: 'Socio actualizado',
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
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Información!',
          text: 'Proceso cancelado, no se actualizo ningún dato.',
          confirmButtonText: 'Entendido',
        });
      }
    });
  }
}

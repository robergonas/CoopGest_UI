import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of } from 'rxjs';
import { constants } from '../../../../constants/constants';

import { OperationService } from '../../../service/operation.service';
import { Partner } from '../../../../interface/partner';
import { Setting } from '../../../../interface/setting';
import { Fee } from '../../../../interface/fee';

@Component({
  selector: 'app-loan',
  standalone: false,

  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoanComponent {
  myForm: FormGroup;
  idUserCreation = constants.current_User()!.idPartner;

  constructor(
    private operationService: OperationService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      idPartner: [''],
      item: [''],
    });
  }

  ngOnInit() {
    this.onSearch();
    this.feeList$ = this.onGetSettingValue(1, 0);
    this.fixedPayment$ = this.onGetSettingValue(4, 0);
  }

  partnerList: Partner[] = [];
  feeList: Fee[] = [];
  feeList$!: Observable<Setting[]>;
  informationMessage: string = '';
  fixedPayment$!: Observable<Setting[]>;

  onSetLoanAdd({
    item,
    textItem,
    idPartner,
    amount,
  }: {
    item: string;
    textItem: string;
    idPartner: string;
    amount: string;
  }): void {
    Swal.fire({
      icon: 'question',
      title: `Esta seguro de generar el prestamo?`,
      text: `Se generará un prestamo por S/. ${amount} en ${textItem}.`,
      showDenyButton: true,
      confirmButtonText: 'Si, estoy seguro.',
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService
          .onLoanAdd(item, idPartner, amount, this.idUserCreation.toString())
          .subscribe((response) => {
            if (response.state) {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Registro del prestamo se realizo de manera correcta.',
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
        Swal.fire({
          icon: 'info',
          title: 'Información!',
          text: 'Proceso cancelado, no se registro ningún prestamo.',
          confirmButtonText: 'Entendido',
        });
      }
    });
  }

  onGetFeList({
    item,
    idPartner,
    amount,
  }: {
    item: string;
    idPartner: string;
    amount: string;
  }): void {
    this.operationService
      .onGetFeeList(item, idPartner, amount)
      .subscribe((response) => {
        if (response.state) {
          this.feeList = response.list || [];
          this.informationMessage = response.message || '';
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

  onPartnerSelected(idPartner: string): void {
    this.myForm.patchValue({ idPartner: idPartner });
  }

  onItemSelected(item: string, textItem: string): void {
    this.myForm.patchValue({ item: item });
  }

  onGetSettingValue(idTable: number, item: number): Observable<Setting[]> {
    return this.operationService.onGetSettingValue(idTable, item).pipe(
      map((response) => {
        if (response.state) {
          return response.list || [];
        } else {
          throw new Error(response.message || 'Error desconocido');
        }
      }),
      catchError((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message || 'error desconocido.',
          confirmButtonText: 'Entendido',
        });
        return of([]);
      })
    );
  }

  onSearch(): void {
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
}

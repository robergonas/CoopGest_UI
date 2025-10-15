import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { Fee } from '../../../../interface/fee';
import { Setting } from '../../../../interface/setting';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-refinance-modal',
  standalone: false,
  templateUrl: './refinance-modal.component.html',
  styleUrl: './refinance-modal.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }, CurrencyPipe],
})
export class RefinanceModalComponent {
  feeList$!: Observable<Setting[]>;
  feeList: Fee[] = [];
  myForm: FormGroup;
  idPartner: string = '';
  formatedFeeAmount: string = '';

  ngOnInit(): void {
    this.feeList$ = this.onGetSettingValue(1, 0);
    this.idPartner = this.data.idPartner;
  }

  constructor(
    private dialog: MatDialogRef<RefinanceModalComponent>,
    private operationService: OperationService,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private currencyPipe: CurrencyPipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.myForm = this.fb.group({
      idFee: ['0'],
    });
  }

  closeDialog(): void {
    this.dialog.close();
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

  onRefinance(): void {
    Swal.fire({
      title:
        'Desea proceder con la refinanciación, este proceso no es reversible?',
      html: `<p>Esta acción ajustará las cuotas del préstamo según el plan seleccionado.</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, realizar la refinanciación!',
      cancelButtonText: 'No, cancelar la refinanciación.',
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService
          .onRefinancyngOnDemand(this.idPartner, this.myForm.value.idFee)
          .subscribe((response) => {
            if (response.state) {
              this.feeList = response.list || [];
              this.formatedFeeAmount =
                this.currencyPipe.transform(
                  this.feeList[0].feeAmount,
                  'PEN',
                  'symbol',
                  '1.2-2',
                  this.locale
                ) || '';
              Swal.fire({
                title: 'Refinanciación realizada',
                html: `La refinanciación se realizó correctamente, el número de cuota son:<b> ${this.feeList[0].numberOfFee} </b>,
                el valor de cada cuota es: <b>${this.formatedFeeAmount}</b>.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
              });
              this.dialog.close({ success: true, idPartner: this.idPartner });
            } else {
              Swal.fire({
                title: 'Error al procesar la refinanciación',
                text: response.message || 'Error desconocido.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            }
          });
      } else {
        Swal.fire({
          title: 'Operacion cancelada',
          text: 'El proceso de refinanciación de pago fue cancelado, no se realizó ningúna operación.',
          icon: 'info',
        });
      }
    });
  }
}

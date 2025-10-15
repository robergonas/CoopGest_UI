import {
  Component,
  SimpleChanges,
  OnInit,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { registerLocaleData, CurrencyPipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import localepe from '@angular/common/locales/es-PE';

import { OperationService } from '../../service/operation.service';
import { Period } from '../../../interface/period';
import { Bills } from '../../../interface/Bills';

registerLocaleData(localepe);

@Component({
  selector: 'app-bills',
  standalone: false,

  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }, CurrencyPipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class BillsComponent implements OnInit {
  dataLoaded: boolean = false;
  periodList: Period[] = [];
  billsList: Bills[] = [];
  myForm: FormGroup;

  formatedFeeAmount: string = '';

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder,
    private operationService: OperationService,
    private currencyPipe: CurrencyPipe
  ) {
    this.myForm = this.fb.group({
      period: ['0'],
      concept: [''],
      amount: ['0'],
    });
  }

  ngOnInit() {
    this.dataLoaded = false;
    this.onGetPeriod();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['billsList']) {
      this.dataLoaded = true;
    }
  }

  onShowAddBill(): void {
    if (this.myForm.valid) {
      const { period, concept, amount } = this.myForm.value;
      if (period === '0') {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Debe seleccionar el periodo a afectar.',
          confirmButtonText: 'Entendido',
        });
        this.dataLoaded = false;
        document.querySelector('#addBills')?.classList.add('d-none');
        return;
      }
      document.querySelector('#addBills')?.classList.remove('d-none');
      this.dataLoaded = false;
    }
  }

  onAddBill(): void {
    if (this.myForm.valid) {
      const { period, concept, amount } = this.myForm.value;

      this.formatedFeeAmount =
        this.currencyPipe.transform(amount, 'PEN', 'symbol', '1.2-2') || '';

      Swal.fire({
        title: `Esta seguro de registrar el gasto de ${this.formatedFeeAmount} para el periodo seleccionado?`,
        showDenyButton: true,
        confirmButtonText: 'Si, estoy seguro.',
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.operationService
            .onAddBill(amount, period, concept)
            .subscribe((response) => {
              if (response.state) {
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito!',
                  text: 'Gasto agregado correctamente.',
                  confirmButtonText: 'Entendido',
                });
                this.myForm.get('concept')?.reset('');
                this.myForm.get('amount')?.reset('0');

                this.onGetBills();
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
            text: 'Proceso cancelado, no se guardo ningún gasto .',
            confirmButtonText: 'Entendido',
          });
        }
      });
    }
  }

  onGetBills(): void {
    if (this.myForm.valid) {
      document.querySelector('#addBills')?.classList.add('d-none');
      const { period, concept, amount } = this.myForm.value;
      if (period === '0') {
        Swal.fire({
          icon: 'warning',
          title: 'Atención!',
          text: 'Seleccione un periodo.',
          confirmButtonText: 'Entendido',
        });
        return;
      }
      this.operationService.onGetBills(period).subscribe((response) => {
        if (response.state) {
          this.billsList = response.list || [];
          this.dataLoaded = true;
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

  onGetPeriod(): void {
    this.operationService.onGetPeriod().subscribe((response) => {
      if (response.state) {
        this.periodList = response.list || [];
        if (this.periodList.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'No se encontraron periodos disponibles.',
            confirmButtonText: 'Entendido',
          });
        }
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

  onDeactivateBill(idBill: number): void {
    Swal.fire({
      title: `Esta seguro de anular este gasto?`,
      showDenyButton: true,
      confirmButtonText: 'Si, estoy seguro.',
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService.onDeactivateBill(idBill).subscribe((response) => {
          if (response.state) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito!',
              text: 'Gasto anulado correctamente.',
              confirmButtonText: 'Entendido',
            });
            this.onGetBills();
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
          text: 'Proceso cancelado, no se anulo ningún gasto .',
          confirmButtonText: 'Entendido',
        });
      }
    });
  }
}

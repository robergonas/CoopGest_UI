import {
  Component,
  Inject,
  Input,
  SimpleChanges,
  LOCALE_ID,
  Output,
  EventEmitter,
} from '@angular/core';
import { registerLocaleData, CurrencyPipe } from '@angular/common';
import localepe from '@angular/common/locales/es-PE';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Statement } from '../../../../interface/statement';
import { FeeSchedule } from '../../../../interface/fee-schedule';
import { LoanHistory } from '../../../../interface/loan-history';
import { OperationService } from '../../../service/operation.service';
import { RefinanceModalComponent } from '../refinance-modal/refinance-modal.component';

registerLocaleData(localepe);

@Component({
  selector: 'app-payment-detail',
  standalone: false,

  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }, CurrencyPipe],
})
export class PaymentDetailComponent {
  myForm: FormGroup;
  dataLoaded: boolean = false;
  amountToPay: number = 0;
  formattedAmountToPay: string = '';
  formattedFeePayment: string = '';
  formatedAmountMandatoryPayment: string = '';
  formatedFeeAmount: string = '';
  amountMandatoryPayment: number = 0.0;
  totalDifference: number = 0.0;
  formattedPeriod: string = '';

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private currencyPipe: CurrencyPipe,
    private operationService: OperationService
  ) {
    this.myForm = this.fb.group({
      amountToPay: [''],
    });
  }
  @Input() statementList: Statement[] = [];
  @Input() feeScheduleList: FeeSchedule[] = [];
  @Input() loanHistorylist: LoanHistory[] = [];

  @Output() partnerSelected = new EventEmitter<string>();

  ngOnInit() {
    this.dataLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['statementList']) {
      this.dataLoaded = true;
    }
    if (changes['statementList']) {
      this.amountMandatoryPayment = 0.0;
      this.statementList.forEach((statement) => {
        this.amountMandatoryPayment += statement.value;
      });
      if (this.statementList.length > 0) {
        this.formattedPeriod =
          (this.statementList[0].contributionPeriod + '').slice(0, 4) +
          '-' +
          (this.statementList[0].contributionPeriod + '').slice(4);
      }
    }

    if (changes['feeScheduleList']) {
      if (this.feeScheduleList.length === 0) return;

      const firstRow = this.feeScheduleList.find((fee) => fee.paid === false);
      this.totalDifference =
        (firstRow?.initialBalance || 0) +
        (firstRow?.interestAmount || 0) -
        (firstRow?.amountToPay || 0);
    }
  }

  onPay(): void {
    if (this.myForm.valid) {
      const { amountToPay } = this.myForm.value;

      this.formatedFeeAmount =
        this.currencyPipe.transform(
          this.statementList[0]?.feeAmount,
          'PEN',
          'symbol',
          '1.2-2',
          this.locale
        ) || '';

      this.formatedAmountMandatoryPayment =
        this.currencyPipe.transform(
          this.amountMandatoryPayment,
          'PEN',
          'symbol',
          '1.2-2',
          this.locale
        ) || '';

      this.formattedFeePayment =
        this.currencyPipe.transform(
          amountToPay - this.amountMandatoryPayment,
          'PEN',
          'symbol',
          '1.2-2',
          this.locale
        ) || '';

      this.formattedAmountToPay =
        this.currencyPipe.transform(
          amountToPay,
          'PEN',
          'symbol',
          '1.2-2',
          this.locale
        ) || '';
      if (amountToPay < this.amountMandatoryPayment) {
        Swal.fire({
          title: 'Monto insuficiente',
          text: `El monto ingresado (${this.formattedAmountToPay}), es menor al monto obligatorio de pago (${this.formatedAmountMandatoryPayment}), no se puede procesar el pago.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      Swal.fire({
        title: 'Desea proceder con la operación?',
        html: `<br>*** El monto ingresado es de: <strong>${this.formattedAmountToPay}</strong> ***
          <br>Distribución del pago:
          <br>Oblgaciones a pagar: ${this.formatedAmountMandatoryPayment}
          <br><strong>La amortización a la cuota es: ${this.formattedFeePayment} </strong>
          <br>*** Monto de la cuota: <strong>${this.formatedFeeAmount}</strong> ***
          <br><strong>Si el monto excede, se descontará de la siguiente cuota</strong>
          <br><strong>Si el monto es menor que la cuota, el saldo será refinanciado</strong>
          <br>¿Deseas continuar con el pago?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, realizar el pago!',
        cancelButtonText: 'No, cancelar el pago.',
      }).then((result) => {
        if (result.isConfirmed) {
          this.operationService
            .onPay(this.loanHistorylist[0].idPartner, amountToPay)
            .subscribe((response) => {
              if (response.state) {
                Swal.fire({
                  title: 'Pago realizado',
                  text: `El pago se realizó correctamente.`,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                });
                this.partnerSelected.emit(
                  this.loanHistorylist[0].idPartner + ''
                );
                this.myForm.reset();
                this.dataLoaded = false;
              } else {
                Swal.fire({
                  title: 'Error al procesar el pago',
                  text: response.message || 'Error desconocido.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              }
            });
        } else {
          Swal.fire({
            title: 'Operacion cancelada',
            text: 'El proceso de registro de pago fue cancelado, no se realizó ningúna operación.',
            icon: 'info',
          });
        }
      });
    } else {
      console.warn('El formulario no es válido');
    }
  }

  openRefinanceModal(): void {
    const dialogRef = this.dialog.open(RefinanceModalComponent, {
      data: { idPartner: this.feeScheduleList[0].idPartner },
    });
  }
}

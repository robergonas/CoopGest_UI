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

import { Statement } from '../../../../interface/statement';
import { FeeSchedule } from '../../../../interface/fee-schedule';
import { LoanHistory } from '../../../../interface/loan-history';
import { OperationService } from '../../../service/operation.service';

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

      this.formatPeriod(this.statementList[0].contributionPeriod);
    }

    if (changes['feeScheduleList']) {
      this.totalDifference =
        this.feeScheduleList[0].initialBalance +
        this.feeScheduleList.reduce((sum, fee) => sum + fee.interestAmount, 0) -
        this.feeScheduleList.reduce((sum, fee) => sum + fee.amountToPay, 0);
    }
  }

  formatPeriod(period: number): void {
    switch ((period + '').length) {
      case 5:
        this.formattedPeriod = '0' + (period + '').substring(0, 1) + '-';
        break;
      case 6:
        this.formattedPeriod = (period + '').substring(0, 2) + '-';
        break;
    }

    this.formattedPeriod += (period + '').slice(-4);
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
        html: `La distribución del pago es:
          <br>Oblgaciones a pagar: ${this.formatedAmountMandatoryPayment}
          <br><strong>La amortización de la cuota es: ${this.formattedFeePayment} </strong>
          <br>*** Monto de la cuota: <strong>${this.formatedFeeAmount}</strong> ***
          <br>*** El monto ingresado es de: <strong>${this.formattedAmountToPay}</strong> ***
          <br><strong>Si hay monto excedente, este afectará a la siguiente cuota</strong>
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
}

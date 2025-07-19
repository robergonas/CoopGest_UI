import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';

import { OperationService } from '../../../service/operation.service';
import { Partner } from '../../../../interface/partner';
import { Statement } from '../../../../interface/statement';
import { FeeSchedule } from '../../../../interface/fee-schedule';
import { LoanHistory } from '../../../../interface/loan-history';

@Component({
  selector: 'app-payment',
  standalone: false,

  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PaymentComponent {
  myForm: FormGroup;
  partnerList: Partner[] = [];
  statementList: Statement[] = [];
  feeScheduleList: FeeSchedule[] = [];
  loanHistoryList: LoanHistory[] = [];
  idLoan: number = 0;

  constructor(
    private operationService: OperationService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      idPartner: [''],
    });
  }

  ngOnInit() {
    this.onSearch();
  }

  onPartnerSelected(event: any): void {
    this.onGetPayments(event);
    this.onGetFeeSchedule(event);
  }

  onGetPayments(idPartner: string): void {
    this.operationService
      .onGetPartnerStatment(idPartner)
      .subscribe((response) => {
        if (response.state) {
          this.statementList = response.list || [];
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

  onGetFeeSchedule(idPartner: string): void {
    this.operationService
      .onGetFeeSchedule(idPartner, '0')
      .subscribe((response) => {
        if (response.state) {
          this.feeScheduleList = response.list || [];
          if (this.feeScheduleList.length > 0) {
            this.idLoan = this.feeScheduleList[0].idLoan;
            this.onGetLoanHistory();
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

  onGetLoanHistory(): void {
    this.operationService
      .onGetLoanHistory(this.idLoan.toString())
      .subscribe((response) => {
        if (response.state) {
          this.loanHistoryList = response.list || [];
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

import { Component, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { registerLocaleData, CurrencyPipe } from '@angular/common';
import localepe from '@angular/common/locales/es-PE';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Partner } from './../../../interface/partner';
import { OperationService } from '../../service/operation.service';
import { Loan } from '../../../interface/loan';
import { FeeSchedule } from '../../../interface/fee-schedule';
import { LoanHistory } from '../../../interface/loan-history';

registerLocaleData(localepe);

@Component({
  selector: 'app-payment-historial',
  standalone: false,

  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }, CurrencyPipe],
})
export class PaymentHistoryComponent {
  @ViewChild('creditReport', { static: false }) pdfContent!: ElementRef;

  myForm: FormGroup;
  partnerList: Partner[] = [];
  loanList: Loan[] = [];
  selectdLoan: Loan | undefined;
  feeScheduleList: FeeSchedule[] = [];
  loanHistoryList: LoanHistory[] = [];
  dataLoaded: boolean = false;
  idLoan: number = 0;
  totalDifference = 0.0;

  constructor(
    private fb: FormBuilder,
    private operationService: OperationService
  ) {
    this.myForm = this.fb.group({
      idPartner: ['0'],
    });
  }

  ngOnInit() {
    this.onSearchPartner();
    this.dataLoaded = false;
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

  onSelectPartner(event: Event): void {
    const idPartner = (event.target as HTMLSelectElement).value;
    this.operationService.onGetPartnerLoan(idPartner).subscribe((response) => {
      if (response.state) {
        this.loanList = response.list || [];
        this.dataLoaded = true;

        this.feeScheduleList = [];
        this.loanHistoryList = [];
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

  onGetDetailLoan(idLoan: number): void {
    this.operationService
      .onGetFeeSchedule(this.partnerList[0].idPartner + '', idLoan + '')
      .subscribe((response) => {
        if (response.state) {
          this.idLoan = idLoan;
          this.feeScheduleList = response.list || [];
          this.selectdLoan = this.loanList.find(
            (loan) => loan.idLoan == idLoan
          );
          this.onGetLoanHistory();

          this.totalDifference = this.feeScheduleList.reduce(
            (sum, fee) => sum + fee.feeAmount,
            0
          );
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

  async onDownloadCreditReport() {
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingElement.style.display = 'flex';
    loadingElement.style.justifyContent = 'center';
    loadingElement.style.alignItems = 'center';
    loadingElement.style.zIndex = '1000';
    loadingElement.innerHTML =
      '<div style="color: white; font-size: 24px;">Generando PDF...</div>';
    document.body.appendChild(loadingElement);

    try {
      const element = this.pdfContent.nativeElement;

      // Configuración de html2canvas
      const options = {
        scale: 2, // Aumentar para mejor calidad
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#FFFFFF',
      };

      const canvas = await html2canvas(element, options);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Calcular dimensiones para mantener proporción
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Agregar metadata
      pdf.setProperties({
        title: `Historial de Pagos - ${
          this.selectdLoan?.partner
        } - ${new Date().toLocaleDateString()}`,
        subject: 'Reporte de créditos',
        author: 'Cooperativa de ahorro y crédito Mi Familia',
        keywords: 'reporte, financiero, préstamos',
        creator: 'CoopGest',
      });

      pdf.save(
        `historial-pagos- ${
          this.selectdLoan?.partner
        } - ${new Date().getTime()}.pdf`
      );
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      // Ocultar loader
      document.body.removeChild(loadingElement);
    }
  }
}

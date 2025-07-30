import {
  Component,
  Inject,
  LOCALE_ID,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import localepe from '@angular/common/locales/es-PE';
import { registerLocaleData, CurrencyPipe } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Partner } from '../../../interface/partner';
import { OperationService } from '../../service/operation.service';
import { Utility } from '../../../interface/utility';
import { Period } from '../../../interface/period';
import { PartnerSummary } from '../../../interface/PartnerSummary';

registerLocaleData(localepe);

@Component({
  selector: 'app-utility',
  standalone: false,

  templateUrl: './utility.component.html',
  styleUrl: './utility.component.css',
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
export class UtilityComponent {
  partnerList: Partner[] = [];
  utilityList: Utility[] = [];
  periodList: Period[] = [];
  partnerSummaries: PartnerSummary[] = [];
  selectedPartner: Partner | null = null;
  dataLoaded: boolean = false;
  myForm: FormGroup;
  emailPartner: string = '';

  @ViewChild('utilityCardsContainer') utilityCardsContainer!: ElementRef;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private operationService: OperationService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      idPartner: ['0'],
      period: ['0'],
    });
  }

  async generatedPdfAsBase64(htmlElement: HTMLElement): Promise<string> {
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    return pdf.output('datauristring').split(',')[1];
  }

  onPartnerSelected(): void {
    const idPartenerEmail = Number(this.myForm.get('idPartner')?.value);
    this.emailPartner =
      this.partnerList.find((p) => p.idPartner === idPartenerEmail)?.email ??
      'Email no encontrado';
  }

  async OnSendEmail() {
    if (!this.utilityCardsContainer) return;

    Swal.fire({
      title: 'Generando PDF',
      html: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const pdfBase64 = await this.generatedPdfAsBase64(
        this.utilityCardsContainer.nativeElement
      );

      await this.operationService
        .onSendPdfMail(this.emailPartner, pdfBase64)
        .subscribe((response) => {
          if (response.state) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El reporte ha sido enviado por correo',
              confirmButtonText: 'Aceptar',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error al enviar el reporte por correo',
              confirmButtonText: 'Aceptar',
            });
          }
        });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el reporte',
        confirmButtonText: 'Entendido',
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['utilityList']) {
      this.dataLoaded = true;
    }
  }

  ngOnInit() {
    this.onSearchPartner();
    this.onGetPerido();
    this.dataLoaded = false;
  }

  async onExportToPDF() {
    const element = this.utilityCardsContainer.nativeElement;
    const buttons = element.querySelectorAll('button');
    buttons.forEach((btn: HTMLElement) => (btn.style.display = 'none'));

    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollY: 0,
      scrollX: 0,
    };

    try {
      Swal.fire({
        title: 'Generando PDF',
        html: 'Por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const canvas = await html2canvas(element, options);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      buttons.forEach((btn: HTMLElement) => (btn.style.display = ''));

      pdf.save(
        `Distribucion_Utilidades_${new Date().toLocaleDateString()}.pdf`
      );

      Swal.close();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Swal.fire('Error', 'No se pudo generar el PDF', 'error');
      buttons.forEach((btn: HTMLElement) => (btn.style.display = ''));
    }
  }

  onCreateUtilityTable(): void {
    const partnerMap = new Map<number, PartnerSummary>();
    this.utilityList.forEach((item) => {
      if (!partnerMap.has(item.idPartner)) {
        partnerMap.set(item.idPartner, {
          idPartner: item.idPartner,
          name: item.name,
          totalCapital: 0,
          totalUtility: 0,
          netAmount: 0,
          periods: [],
        });
      }

      const partner = partnerMap.get(item.idPartner)!;
      partner.totalCapital = item.partnerCapital;
      partner.totalUtility += item.partnerUtility;
      partner.netAmount = partner.totalCapital + partner.totalUtility;

      partner.periods.push({
        month: item.month,
        periodCapital: item.periodCapital,
        periodUtility: item.periodUtility,
        periodBill: item.periodBill,
        partnerPercentage: item.partnerPercentage,
        partnerCapital: item.partnerCapital,
        partnerUtility: item.partnerUtility,
        totalPeriod: item.partnerCapital + item.partnerUtility,
      });
    });

    this.partnerSummaries = Array.from(partnerMap.values());
    this.dataLoaded = true;
  }

  onGetPerido(): void {
    this.operationService.onGetPeriod().subscribe((response) => {
      if (response.state) {
        this.periodList = response.list || [];
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

  onGetUtility(): void {
    if (this.myForm.valid) {
      const { idPartner, period } = this.myForm.value;
      this.operationService
        .onGetUtility(idPartner, period)
        .subscribe((response) => {
          if (response.state) {
            this.utilityList = response.list || [];
            this.dataLoaded = true;
            this.onCreateUtilityTable();
          } else {
            this.dataLoaded = false;
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response.message || 'error desconocido.',
              confirmButtonText: 'Entendido',
            });
          }
        });
    } else {
      console.warn('El formulario no es válido');
    }
  }
}

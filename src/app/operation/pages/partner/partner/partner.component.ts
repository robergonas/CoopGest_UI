import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

import { OperationService } from '../../../service/operation.service';
import { Partner } from '../../../../interface/partner';
import { Pager } from '../../../../interface/pager';
import { constants } from '../../../../constants/constants';
import { AppService } from '../../../../service/aap-service.service';

@Component({
  selector: 'app-partner',
  standalone: false,

  templateUrl: './partner.component.html',
  styleUrl: './partner.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PartnerComponent {
  partnerList: Partner[] = [];
  pager: Pager;
  name: string = '';
  idDocument: string = '';
  documentNumber: string = '';

  constructor(
    private appService: AppService,
    private operationService: OperationService
  ) {
    this.pager = {
      starRow: constants.starRow,
      endRow: constants.endRow,
      pageSize: constants.pageSize,
      pageNumber: constants.pageNumber,
      totalRecords: constants.totalRecords,
      pages: [],
    };
  }

  onSearch({
    name,
    idDocument,
    documentNumber,
  }: {
    name: string;
    idDocument: string;
    documentNumber: string;
  }): void {
    this.name = name;
    this.idDocument = idDocument;
    this.documentNumber = documentNumber;

    const { pageSize, pageNumber } = this.pager;
    this.operationService
      .onSearchPartner(
        name,
        parseInt(idDocument),
        documentNumber,
        pageSize,
        pageNumber
      )
      .subscribe((response) => {
        if (response.state) {
          this.partnerList = response.list || [];
          if (this.partnerList.length > 0) {
            this.pager.totalRecords = this.partnerList[0].totalRecords;
            this.updatePager();
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

  goToPage(page: number) {
    this.pager.pageNumber = page;
    const searchParams = {
      name: this.name,
      idDocument: this.idDocument,
      documentNumber: this.documentNumber,
    };
    this.onSearch(searchParams);
  }

  updatePager() {
    this.pager.starRow = (this.pager.pageNumber - 1) * this.pager.pageSize + 1;
    this.pager.endRow = Math.min(
      this.pager.pageNumber * this.pager.pageSize,
      this.pager.totalRecords
    );
    this.appService.setPager(this.pager);
  }
}

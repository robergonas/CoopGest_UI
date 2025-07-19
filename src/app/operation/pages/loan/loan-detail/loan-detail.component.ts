import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localepe from '@angular/common/locales/es-PE';

import { Fee } from '../../../../interface/fee';

registerLocaleData(localepe);

@Component({
  selector: 'app-loan-detail',
  standalone: false,

  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }],
})
export class LoanDetailComponent implements OnInit {
  dataLoaded: boolean = false;
  totalFee: number = 0;
  totalRate: number = 0;
  messageLines: string[] = [];
  currentDate = new Date();

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  @Input() feeList: Fee[] = [];
  @Input() informationMessage: string = '';

  ngOnInit(): void {
    this.dataLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['feeList']) {
      this.messageLines = this.informationMessage.split('<br>');
      this.dataLoaded = true;
      this.totalRate = this.feeList.reduce(
        (acc, fee) => acc + fee.rateAmount,
        0
      );

      this.totalFee = this.feeList[0].initialBalance + this.totalRate;
    }
  }
}

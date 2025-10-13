import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localepe from '@angular/common/locales/es-PE';
import Swal from 'sweetalert2';

import { Partner } from '../../../../interface/partner';
import { Setting } from '../../../../interface/setting';

registerLocaleData(localepe);

@Component({
  selector: 'app-loan-header',
  standalone: false,

  templateUrl: './loan-header.component.html',
  styleUrl: './loan-header.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }],
})
export class LoanHeaderComponent {
  textItem: string = '';

  @Input() partnerList: Partner[] = [];
  @Input() feeList$!: Observable<Setting[]>;
  @Input() fixedPayment$!: Observable<Setting[]>;

  @Output() partnerSelected = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<{
    item: string;
    textItem: string;
  }>();

  @Output() SetLoanAdd = new EventEmitter<{
    item: string;
    textItem: string;
    idPartner: string;
    amount: string;
  }>();

  @Output() GetFeeList = new EventEmitter<{
    item: string;
    idPartner: string;
    amount: string;
  }>();

  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      item: ['0'],
      idPartner: ['0'],
      amount: [''],
    });
  }

  onLoanAdd(): void {
    let error = false;
    let message = '';
    if (this.myForm.valid) {
      const { item, idPartner, amount } = this.myForm.value;
      if (item === '0' || idPartner === '0') {
        error = true;
        message = 'Seleccione número de cuotas.<br>';
      }
      if (idPartner === '0') {
        error = true;
        message += 'Seleccione socio.<br>';
      }
      if (amount === '' || amount === '0') {
        error = true;
        message += 'Ingrese monto del prestamo.<br>';
      }
      if (error) {
        Swal.fire({
          icon: 'info',
          title: 'Atención!',
          html: message,
          confirmButtonText: 'Entendido',
        });
        return;
      } else
        this.SetLoanAdd.emit({
          item: item,
          textItem: this.textItem,
          idPartner: idPartner,
          amount: amount,
        });
    } else {
      console.warn('El formulario no es válido');
    }
  }

  onGetFeeList(): void {
    let error = false;
    let message = '';
    if (this.myForm.valid) {
      const { item, idPartner, amount } = this.myForm.value;
      if (item === '0' || idPartner === '0') {
        error = true;
        message = 'Seleccione número de cuotas.<br>';
      }
      if (idPartner === '0') {
        error = true;
        message += 'Seleccione socio.<br>';
      }
      if (amount === '' || amount === '0') {
        error = true;
        message += 'Ingrese monto del prestamo.<br>';
      }
      if (error) {
        Swal.fire({
          icon: 'info',
          title: 'Atención!',
          html: message,
          confirmButtonText: 'Entendido',
        });
        return;
      } else
        this.GetFeeList.emit({
          item: item,
          idPartner: idPartner,
          amount: amount,
        });
    } else {
      console.warn('El formulario no es válido');
    }
  }

  onSelectFee(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.textItem = selectElement.options[selectElement.selectedIndex].text;
    const selectValue = selectElement.value;
    this.itemSelected.emit({ item: selectValue, textItem: this.textItem });
  }

  onSelectPartner(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.partnerSelected.emit(selectedValue);
  }
}

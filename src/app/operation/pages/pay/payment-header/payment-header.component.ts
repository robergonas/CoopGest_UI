import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

import { Partner } from '../../../../interface/partner';

@Component({
  selector: 'app-payment-header',
  standalone: false,

  templateUrl: './payment-header.component.html',
  styleUrl: './payment-header.component.css',
})
export class PaymentHeaderComponent {
  myForm: FormGroup;

  @Output() partnerSelected = new EventEmitter<string>();

  @Input() partnerList: Partner[] = [];

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      idPartner: ['0'],
    });
  }

  onSelectPartner(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.partnerSelected.emit(selectedValue);
  }

  onGetPayments(): void {
    const { idPartner } = this.myForm.value;
    if (idPartner === '0' || idPartner === '') {
      Swal.fire({
        icon: 'info',
        title: 'Info!',
        text: 'Seleccione socio.',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    this.partnerSelected.emit(idPartner);
    console.log('Socio seleccionado:', idPartner);
  }
}

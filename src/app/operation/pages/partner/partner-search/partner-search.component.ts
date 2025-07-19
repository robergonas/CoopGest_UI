import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ManagePartnerComponent } from '../manage-partner/manage-partner.component';

@Component({
  selector: 'app-partner-search',
  standalone: false,

  templateUrl: './partner-search.component.html',
  styleUrl: './partner-search.component.css',
})
export class PartnerSearchComponent {
  @Output() search = new EventEmitter<{
    name: string;
    documentNumber: string;
    idDocument: string;
  }>();

  myForm: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      name: [''],
      documentNumber: [''],
      idDocument: [''],
    });
  }
  onNew(): void {
    const dialogRef = this.dialog.open(ManagePartnerComponent, {
      data: { savePartner: true },
    });
  }
  onEnter() {
    const { name, documentNumber, idDocument } = this.myForm.value;
    this.search.emit({ name, documentNumber, idDocument });
  }

  onDocumentTypeSelected(idDocument: string): void {
    this.myForm.patchValue({ idDocument: idDocument });
  }

  onSearch(): void {
    if (this.myForm.valid) {
      const { name, documentNumber, idDocument } = this.myForm.value;
      this.search.emit({ name, documentNumber, idDocument });
    } else {
      console.warn('El formulario no es válido');
    }
  }
}

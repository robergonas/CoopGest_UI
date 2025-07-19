import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

import { Partner } from '../../../../interface/partner';
import { OperationService } from '../../../service/operation.service';
import { ManagePartnerComponent } from '../manage-partner/manage-partner.component';

@Component({
  selector: 'app-partner-list',
  standalone: false,

  templateUrl: './partner-list.component.html',
  styleUrl: './partner-list.component.css',
})
export class PartnerListComponent implements OnInit, OnChanges {
  dataLoaded: boolean = false;

  @Output() search = new EventEmitter<{
    name: string;
    documentNumber: string;
    idDocument: string;
  }>();
  @Output() savePartner = new EventEmitter<boolean>();

  @Input() partnerList: Partner[] = [];
  @Input() showEditbutton: boolean = false;
  @Input() showEnabledbutton: boolean = false;
  @Input() showDisabledbutton: boolean = false;
  @Input() showSelectdbutton: boolean = false;

  constructor(
    private operationService: OperationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['partnerList']) {
      this.dataLoaded = true;
    }
  }

  cargarDatos(): Partner[] {
    return [];
  }

  onSelectedPartner(partner: Partner): void {}

  onEditPartner(partner: Partner): void {
    const dialogRef = this.dialog.open(ManagePartnerComponent, {
      //width: '100%',
      data: { partner: partner, savePartner: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(
        `Datos nombre: ${partner.name} Documento: ${partner.documentNumber} idDocument: ${partner.idDocument}`
      );
      this.search.emit({
        name: partner.name,
        documentNumber: '',
        idDocument: '',
      });
    });
  }

  onEnabledPartner(partner: Partner): void {
    Swal.fire({
      title: 'Habilitar al socio',
      text: 'Esta seguro de habilitar al socio ' + partner.name + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, habilitar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService
          .onDisabledPartner(partner.idPartner, 1)
          .subscribe((response) => {
            if (response.state) {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Socio habilitado',
                confirmButtonText: 'Entendido',
              });
              this.search.emit({
                name: partner.name,
                documentNumber: partner.documentNumber,
                idDocument: partner.idDocument.toString(),
              });
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
    });
  }

  onDisabledPartner(partner: Partner): void {
    Swal.fire({
      title: 'deshabilitar al socio',
      text: 'Esta seguro de deshabilitar al socio ' + partner.name + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.operationService
          .onDisabledPartner(partner.idPartner, 0)
          .subscribe((response) => {
            if (response.state) {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Socio deshabilitado',
                confirmButtonText: 'Entendido',
              });

              this.search.emit({
                name: partner.name,
                documentNumber: partner.documentNumber,
                idDocument: partner.idDocument.toString(),
              });
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
    });
  }
}

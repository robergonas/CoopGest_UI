import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Period } from '../../interface/period';
import { OperationService } from '../../operation/service/operation.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-periods',
  standalone: false,

  templateUrl: './pending-periods.component.html',
  styleUrl: './pending-periods.component.css',
})
export class PendingPeriodsComponent {
  pendingPeriods: Period[] = [];
  myForm: FormGroup;

  constructor(
    private operationService: OperationService,
    private dialogRef: MatDialogRef<PendingPeriodsComponent>,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      currentPeriod: ['0'],
    });
  }
  ngOnInit() {
    this.onLoadPendingPeriods();
  }

  @Output() isClosingProcess = new EventEmitter<number>();

  onLoadPendingPeriods(): void {
    this.operationService.onGetPendingPeriod().subscribe((response) => {
      if (response.state) {
        this.pendingPeriods = response.list || [];
      } else {
        console.error(response.message);
      }
    });
  }

  onProcessPeriod(): void {
    if (this.myForm.valid) {
      const { currentPeriod } = this.myForm.value;

      if (currentPeriod === '0') {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Seleccione un periodo',
          confirmButtonText: 'Entendido',
        });
        return;
      }

      this.operationService.onSetDistributeUtility(currentPeriod).subscribe({
        next: (response) => {
          if (response.state) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito!',
              text: 'El periodo ha sido procesado',
              confirmButtonText: 'Entendido',
            });

            this.onLoadPendingPeriods();
            this.isClosingProcess.emit(1);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response.message || 'Error desconocido',
              confirmButtonText: 'Entendido',
            });
            this.isClosingProcess.emit(0);
          }
        },
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

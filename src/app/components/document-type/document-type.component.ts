import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  forwardRef,
} from '@angular/core';
import { DocumentType } from '../../interface/document-type';
import { DocumentTypeService } from '../../auth/services/document-type.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-document-type',
  standalone: false,

  templateUrl: './document-type.component.html',
  styleUrl: './document-type.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentTypeComponent),
      multi: true,
    },
  ],
})
export class DocumentTypeComponent implements OnInit, ControlValueAccessor {
  documentList: DocumentType[] = [];

  constructor(private documentTypeService: DocumentTypeService) {}
  ngOnInit() {
    this.onLoadDocumentType();
  }

  @Output() documentTypeSelected = new EventEmitter<string>();
  @Input() idDocument: number = 0;

  onSelectDocumentType(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.documentTypeSelected.emit(selectedValue);
  }

  onLoadDocumentType(): void {
    this.documentTypeService.onGetDocumentType(0).subscribe((response) => {
      this.documentList = response.list || [];
    });
  }

  onChange: any = () => [];
  onTouched: any = () => [];
  writeValue(value: any): void {
    this.idDocument = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
}

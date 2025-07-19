import { Injectable } from '@angular/core';
import { constants } from '../../constants/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EncryptionService } from '../../functions/encryption.service';
import { DocumentType } from '../../interface/document-type';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  constructor(
    private encryption: EncryptionService,
    private http: HttpClient
  ) {}

  onGetDocumentType(idDocument: number = 0): Observable<any> {
    const encryptedIdDocument = this.encryption.encryptData(
      idDocument.toString()
    );

    const body = JSON.stringify('{"idDocument":"' + encryptedIdDocument + '"}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_PARTNER}GetDocumentType`, body, {
        headers,
      })
      .pipe(
        catchError((error: any): Observable<any> => {
          return new Observable((observer) => {
            observer.next({
              state: false,
              message: error.message,
            });
            observer.complete();
          });
        })
      );
  }
}

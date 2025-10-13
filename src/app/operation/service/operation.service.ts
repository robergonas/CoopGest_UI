import { EncryptionService } from './../../functions/encryption.service';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  JsonpInterceptor,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { constants } from '../../constants/constants';
import { Partner } from '../../interface/partner';
import { json } from 'stream/consumers';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  constructor(
    private encryption: EncryptionService,
    private http: HttpClient
  ) {}

  onEnabledPartner(idPartner: number, active: number): Observable<any> {
    const encryptionIdPartner = this.encryption.encryptData(
      idPartner.toString()
    );
    const encryptionidUserModification = this.encryption.encryptData(
      constants.current_User()!.idPartner.toString()
    );
    const encryptionActive = this.encryption.encryptData(active.toString());

    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptionIdPartner +
        '","idUserModification":"' +
        encryptionidUserModification +
        '","active":"' +
        encryptionActive +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_PARTNER}DeletePartner`, body, {
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

  onDisabledPartner(idPartner: number, active: number): Observable<any> {
    const encryptionIdPartner = this.encryption.encryptData(
      idPartner.toString()
    );
    const encryptionidUserModification = this.encryption.encryptData(
      constants.current_User()!.idPartner.toString()
    );
    const encryptionActive = this.encryption.encryptData(active.toString());

    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptionIdPartner +
        '","idUserModification":"' +
        encryptionidUserModification +
        '","active":"' +
        encryptionActive +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_PARTNER}DeletePartner`, body, {
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

  onSavePartner(
    name: string,
    address: string,
    idDocument: number,
    documentNumber: string,
    email: string,
    phoneNumber: string,
    birthDate: string,
    active: number,
    idUserCreation: number
  ): Observable<any> {
    const encryptionName = this.encryption.encryptData(name);
    const encryptionAddress = this.encryption.encryptData(address);
    const encryptionIdDocument = this.encryption.encryptData(
      idDocument.toString()
    );
    const encryptionDocumentNumber =
      this.encryption.encryptData(documentNumber);
    const encryptionEmail = this.encryption.encryptData(email);
    const encryptionPhoneNumber = this.encryption.encryptData(phoneNumber);
    const encryptionBirthDate = this.encryption.encryptData(birthDate);
    const encryptionActive = this.encryption.encryptData(active.toString());
    const encryptionIdUserCreation = this.encryption.encryptData(
      idUserCreation.toString()
    );

    const body = JSON.stringify(
      '{"name":"' +
        encryptionName +
        '","address":"' +
        encryptionAddress +
        '","idDocument":"' +
        encryptionIdDocument +
        '","documentNumber":"' +
        encryptionDocumentNumber +
        '","email":"' +
        encryptionEmail +
        '","phoneNumber":"' +
        encryptionPhoneNumber +
        '","birthDate":"' +
        encryptionBirthDate +
        '","idUserCreation":"' +
        encryptionIdUserCreation +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_PARTNER}AddPartner`, body, {
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

  onUpdPartner(
    idPartner: number,
    name: string,
    address: string,
    idDocument: number,
    documentNumber: string,
    email: string,
    phoneNumber: string,
    birthDate: string,
    active: number,
    idUserModification: number
  ): Observable<any> {
    const encryptionIdPartner = this.encryption.encryptData(
      idPartner.toString()
    );
    const encryptionName = this.encryption.encryptData(name);
    const encryptionAddress = this.encryption.encryptData(address);
    const encryptionIdDocument = this.encryption.encryptData(
      idDocument.toString()
    );
    const encryptionDocumentNumber =
      this.encryption.encryptData(documentNumber);
    const encryptionEmail = this.encryption.encryptData(email);
    const encryptionPhoneNumber = this.encryption.encryptData(phoneNumber);
    const encryptionBirthDate = this.encryption.encryptData(birthDate);
    const encryptionActive = this.encryption.encryptData(active.toString());
    const encryptionIdUserModification = this.encryption.encryptData(
      idUserModification.toString()
    );

    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptionIdPartner +
        '","name":"' +
        encryptionName +
        '","address":"' +
        encryptionAddress +
        '","idDocument":"' +
        encryptionIdDocument +
        '","documentNumber":"' +
        encryptionDocumentNumber +
        '","email":"' +
        encryptionEmail +
        '","phoneNumber":"' +
        encryptionPhoneNumber +
        '","birthDate":"' +
        encryptionBirthDate +
        '","active":"' +
        encryptionActive +
        '","idUserModification":"' +
        encryptionIdUserModification +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_PARTNER}UpdatePartner`, body, {
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

  onSearchPartner(
    name: string,
    idDocument: number,
    documentNumber: string,
    pageSize: number,
    pageNumber: number
  ): Observable<any> {
    const encryptedName = this.encryption.encryptData(name);
    const encryptedIdDocument = this.encryption.encryptData(
      idDocument.toString()
    );
    const encryptedPageNumber = this.encryption.encryptData(
      pageNumber.toString()
    );
    const encryptedPageSize = this.encryption.encryptData(pageSize.toString());
    const encryptedDocumentNumber = this.encryption.encryptData(documentNumber);
    const body = JSON.stringify(
      '{"name":"' +
        encryptedName +
        '","idDocument":"' +
        encryptedIdDocument +
        '","documentNumber":"' +
        encryptedDocumentNumber +
        '","pageNumber":"' +
        encryptedPageNumber +
        '","pageSize":"' +
        encryptedPageSize +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_PARTNER}GetAllPartner`, body, {
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

  onGetSettingValue(idTable: number, item: number): Observable<any> {
    const encryptedIdTable = this.encryption.encryptData(idTable.toString());
    const encryptedItem = this.encryption.encryptData(item.toString());
    const body = JSON.stringify(
      '{"idTable":"' + encryptedIdTable + '","item":"' + encryptedItem + '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_SETTING}GetSettingValue`, body, {
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

  onLoanAdd(
    item: string,
    idPartner: string,
    amount: string,
    idUserCreation: string
  ) {
    const encryptedItem = this.encryption.encryptData(item);
    const encryptedIdPartner = this.encryption.encryptData(idPartner);
    const encryptedAmount = this.encryption.encryptData(amount.toString());
    const encryptedIdUserCreation = this.encryption.encryptData(idUserCreation);

    const body = JSON.stringify(
      '{"idFee":"' +
        encryptedItem +
        '","idPartner":"' +
        encryptedIdPartner +
        '","amount":"' +
        encryptedAmount +
        '","idUserCreation":"' +
        encryptedIdUserCreation +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}BulkInsertFeeSchedule`, body, {
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

  onGetFeeList(
    item: string,
    idPartner: string,
    amount: string
  ): Observable<any> {
    const encryptedItem = this.encryption.encryptData(item);
    const encryptedIdPartner = this.encryption.encryptData(idPartner);
    const encryptedAmount = this.encryption.encryptData(amount.toString());
    const body = JSON.stringify(
      '{"idFee":"' +
        encryptedItem +
        '","idPartner":"' +
        encryptedIdPartner +
        '","amount":"' +
        encryptedAmount +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetFeeList`, body, {
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

  onGetPartnerStatment(idPartner: string): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner);
    const body = JSON.stringify('{"idPartner":"' + encryptedIdPartner + '"}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetPartnerStatement`, body, {
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

  onGetFeeSchedule(idPartner: string, idLoan: string): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner);
    const encryptedIdLoan = this.encryption.encryptData(idLoan);
    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptedIdPartner +
        '","idLoan":"' +
        encryptedIdLoan +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetFeeSchedule`, body, {
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

  onGetLoanHistory(idLoan: string): Observable<any> {
    const encryptedIdLoan = this.encryption.encryptData(idLoan);
    const body = JSON.stringify('{"idLoan":"' + encryptedIdLoan + '"}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetLoanHistory`, body, {
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

  onPay(idPartner: number, amountToPay: number): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner + '');
    const encryptedAmountToPay = this.encryption.encryptData(amountToPay + '');
    const encryptedIdUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );

    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptedIdPartner +
        '","idUser":"' +
        encryptedIdUser +
        '","amountToPay":"' +
        encryptedAmountToPay +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}SetAmountToPay`, body, {
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

  onGetPartnerLoan(idPartner: string): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner + '');
    const body = JSON.stringify('{"idPartner":"' + encryptedIdPartner + '"}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetPartnerLoan`, body, {
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

  onGetPeriod(): Observable<any> {
    const body = JSON.stringify('{}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetPeriod`, body, {
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

  onGetPendingPeriod(): Observable<any> {
    const body = JSON.stringify('{}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetPendingPeriod`, body, {
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

  onGetBills(period: string): Observable<any> {
    const encryptedPeriod = this.encryption.encryptData(period);
    const body = JSON.stringify('{"period":"' + encryptedPeriod + '"}');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetBills`, body, {
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

  onAddBill(amount: string, period: string, concept: string): Observable<any> {
    const encryptedAmount = this.encryption.encryptData(amount + '');
    const encryptedPeriod = this.encryption.encryptData(period);
    const encryptedConcept = this.encryption.encryptData(concept);
    const encryptedIdUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );
    const body = JSON.stringify(
      '{"amount":"' +
        encryptedAmount +
        '","period":"' +
        encryptedPeriod +
        '","concept":"' +
        encryptedConcept +
        '","idUser":"' +
        encryptedIdUser +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}SetAddBills`, body, {
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

  onDeactivateBill(idBull: number): Observable<any> {
    const encryptedIdBill = this.encryption.encryptData(idBull + '');
    const encryptedIdUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );
    const body = JSON.stringify(
      '{"idBill":"' + encryptedIdBill + '","idUser":"' + encryptedIdUser + '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}SetDeactivateBill`, body, {
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

  onGetUtility(idPartner: string, period: string): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner);
    const encryptedPeriod = this.encryption.encryptData(period);
    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptedIdPartner +
        '","period":"' +
        encryptedPeriod +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}GetUtility`, body, {
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

  onGetUser(name: string, userName: string): Observable<any> {
    const encryptedUserName = this.encryption.encryptData(userName);
    const encryptedFullName = this.encryption.encryptData(name);
    const encryptedDocumentNumber = this.encryption.encryptData('');
    const encryptedIdDocument = this.encryption.encryptData('0');
    const encryptedPageNumber = this.encryption.encryptData('1');
    const encryptedPageSize = this.encryption.encryptData('1000');
    const body = JSON.stringify(
      '{"userName":"' +
        encryptedUserName +
        '","fullName":"' +
        encryptedFullName +
        '","idDocument":"' +
        encryptedIdDocument +
        '","documentNumber":"' +
        encryptedDocumentNumber +
        '","pageNumber":"' +
        encryptedPageNumber +
        '","pageSize":"' +
        encryptedPageSize +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_USERAPP}GetAllUser`, body, { headers })
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

  onChangeUserStatus(idPartner: number, active: boolean): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner + '');
    let encryptedActive: string = '';

    if (active) encryptedActive = this.encryption.encryptData('1');
    else encryptedActive = this.encryption.encryptData('0');

    const encryptedIdUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );
    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptedIdPartner +
        '","active":"' +
        encryptedActive +
        '","idUser":"' +
        encryptedIdUser +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`${constants.BASE_URL_USERAPP}SetUserStatus`, body, {
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

  onUserAdd(
    idPartner: string,
    userName: string,
    pasword: string
  ): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner + '');
    const encryptedUserName = this.encryption.encryptData(userName);
    const encryptedPassword = this.encryption.encryptData(pasword);
    const encryptedIdUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );
    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptedIdPartner +
        '","userName":"' +
        encryptedUserName +
        '","password":"' +
        encryptedPassword +
        '","idUserCreation":"' +
        encryptedIdUser +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_USERAPP}SetUserAdd`, body, {
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

  onSendPdfMail(idPartner: string, pdfBase64: string): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner);
    const body = JSON.stringify(
      '{"email":"' + encryptedIdPartner + '","pdfBase64":"' + pdfBase64 + '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}SendPdfEmail`, body, {
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

  onRefinancyngOnDemand(idPartner: string, idFee: string): Observable<any> {
    const encryptedIdPartner = this.encryption.encryptData(idPartner + '');
    const encryptedIdFee = this.encryption.encryptData(idFee);
    const encryptedIdUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );
    const body = JSON.stringify(
      '{"idPartner":"' +
        encryptedIdPartner +
        '","idFee":"' +
        encryptedIdFee +
        '","idUser":"' +
        encryptedIdUser +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}SetRefinancingOnDemand`, body, {
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

  onSetDistributeUtility(period: string): Observable<any> {
    const encryptedPeriod = this.encryption.encryptData(period);
    const encryptedUser = this.encryption.encryptData(
      constants.current_User()!.idPartner + ''
    );
    const body = JSON.stringify(
      '{"idUser":"' + encryptedUser + '","period":"' + encryptedPeriod + '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_LOAN}SetDistributeUtility`, body, {
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

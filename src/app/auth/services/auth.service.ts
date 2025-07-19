import { Injectable } from '@angular/core';
import { constants } from '../../constants/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EncryptionService } from '../../functions/encryption.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(
    private encryption: EncryptionService,
    private http: HttpClient
  ) {}

  onChangePassword(userName: string, password: string): Observable<any> {
    const encryptedUserName = this.encryption.encryptData(userName);
    const encryptedPassword = this.encryption.encryptData(password);
    const body = JSON.stringify(
      '{"userName":"' +
        encryptedUserName +
        '","password":"' +
        encryptedPassword +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_USERAPP}SetChangePassword`, body, {
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

  onForgotPassword(userName: string, email: string): Observable<any> {
    const encryptedUserName = this.encryption.encryptData(userName);
    const encryptedEmail = this.encryption.encryptData(email);
    const body = JSON.stringify(
      '{"userName":"' +
        encryptedUserName +
        '","email":"' +
        encryptedEmail +
        '"}'
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_USERAPP}RecoverPassword`, body, {
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

  onLogin(userName: string, password: string): Observable<any> {
    const encryptedUserName = this.encryption.encryptData(userName);
    const encryptedPassword = this.encryption.encryptData(password);
    const body = JSON.stringify(
      '{"userName":"' +
        encryptedUserName +
        '","password":"' +
        encryptedPassword +
        '"}'
    );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${constants.BASE_URL_USERAPP}GetUserLogin`, body, {
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

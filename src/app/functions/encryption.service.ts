import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  private readonly aesKey = '0123456789abcdef';
  private readonly aesIV = 'abcdef0123456789';

  encryptData(data: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.aesKey);
    const iv = CryptoJS.enc.Utf8.parse(this.aesIV);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decryptedData(encryptedData: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.aesKey);
    const iv = CryptoJS.enc.Utf8.parse(this.aesIV);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

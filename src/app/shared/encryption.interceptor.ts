import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const secretKey = 'SystemOneCore2025**';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  // Encriptar datos
  public encryptData(data: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encrypted;
  }

  // Desencriptar datos
  public decryptData(encryptedData: any): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}

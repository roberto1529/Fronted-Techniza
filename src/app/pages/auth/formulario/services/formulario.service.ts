import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EncryptionService } from '../../../../shared/encryption.interceptor';
import { API_ENDPOINT } from '../../../../shared/env/endpoints';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  protected endpoint: string = `${API_ENDPOINT}auth/v1/`;

  constructor(private http: HttpClient, private readonly cto: EncryptionService) {}

  public Auth_Service(data: any) {
 
    // Encriptar datos antes de enviarlos
    const encryptedData = {
      data: this.cto.encryptData(data)
    };
    return this.http.post(this.endpoint, encryptedData);  // Enviar datos encriptados
  }

  public Auth_Validar_token(data: any){
    // Encriptar datos antes de enviarlos
    const encryptedData = {data: this.cto.encryptData(data)};
    return this.http.post(this.endpoint+'verificar_2fa', encryptedData);  // Enviar datos encriptados
  }
}

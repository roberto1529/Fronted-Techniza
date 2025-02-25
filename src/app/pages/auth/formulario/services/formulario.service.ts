import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EncryptionService } from '../../../../shared/encryption.interceptor';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  ep: any = "";

  constructor(private http: HttpClient, private readonly cto: EncryptionService) {}

  public Auth_Service(data: any) {
    const { host, port, modulo, version, rutas } = this.ep;
    const endpoint = `${host}${port}${modulo}${version}${rutas.index}`;

    // Encriptar datos antes de enviarlos
    const encryptedData = {
      data: this.cto.encryptData(data)
    };
    return this.http.post(endpoint, encryptedData);  // Enviar datos encriptados
  }

  public Auth_Validar_token(data: any){

    const { host, port, modulo, version, rutas } = this.ep;
    const endpoint = `${host}${port}${modulo}${version}${rutas.token}`;

    // Encriptar datos antes de enviarlos
    const encryptedData = {
      data: this.cto.encryptData(data)
    };
    return this.http.post(endpoint, encryptedData);  // Enviar datos encriptados
  }
}

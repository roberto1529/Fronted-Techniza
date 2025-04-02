import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EncryptionService } from '../../../shared/encryption.interceptor';
import { API_ENDPOINT } from '../../../shared/env/endpoints';
@Injectable({
  providedIn: 'root'
})
export class Endpoint {
  protected endpoint: string = `${API_ENDPOINT}productos`;
  constructor(private http: HttpClient, private crypto: EncryptionService) { }

  public getAll(){
      return this.http.get<any>(this.endpoint);
  }
  
  public getAllUsarios(){
    return this.http.get<any>(this.endpoint+'/usuarios');
  }

  public SetData(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.post(this.endpoint+'/CrearDatos', send);
  }

  public SetEstado(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.put(this.endpoint+'/UpdateEstado', send);
  }

  public PutUser(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.put(this.endpoint+'/ActualizarDatos', send);
  }

  public SetDataMarca(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.post(this.endpoint+'/CrearMarca', send);
  }

  public PutDataMarca(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.put(this.endpoint+'/EditarMarca', send);
  }

  public PutDataMarcaEstado(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.put(this.endpoint+'/EditarMarcaEstado', send);
  }
}

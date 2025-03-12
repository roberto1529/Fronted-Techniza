import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { empleadosDto, usuarioDto } from '../types/dto.interface';
import { EncryptionService } from '../../../shared/encryption.interceptor';
import { API_ENDPOINT } from '../../../shared/env/endpoints';
@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  protected endpoint: string = `${API_ENDPOINT}empleados`;
  constructor(private http: HttpClient, private crypto: EncryptionService) { }

  public getAllEmpleados(){
      return this.http.get<empleadosDto>(this.endpoint);
  }
  
  public getAllUsarios(){
    return this.http.get<usuarioDto>(this.endpoint+'/usuarios');
  }

  public SetUser(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.post(this.endpoint+'/CrearUsu', send);
  }

  public SetEstado(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.put(this.endpoint+'/UpdateEstado', send);
  }

  public PutUser(dato: any){
    let datos = this.crypto.encryptData(dato);
    const send = {data: datos}
    return this.http.put(this.endpoint+'/ActualizarUsu', send);
  }

}

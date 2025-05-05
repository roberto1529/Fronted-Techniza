import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EncryptionService } from '../../../shared/encryption.interceptor';
import { API_ENDPOINT, API_ENDPOINT_REPORT } from '../../../shared/env/endpoints';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  protected endpoint: string = `${API_ENDPOINT}facturas`;
  protected endpointrp: string = `${API_ENDPOINT_REPORT}`;
  constructor(private http: HttpClient, private crypto: EncryptionService) { }

  public getAll() {
    return this.http.get<any>(this.endpoint);
  }

  public GetUser(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/facturdos', send);
  }

  public Setdara(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/CrearDatos', send);
  }

  public SetEstado(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.put(this.endpoint + '/UpdateEstado', send);
  }

  public PutData(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.put(this.endpoint + '/ActualizarDatos', send);
  }

  public GetdataProd(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/CargadorProductos', send);
  }

  // mdetodo de reporteador

  public getFactura(id: number): Observable<Blob> {
    return this.http.get(`${this.endpointrp}generate-fact/${id}`, {
      responseType: 'blob' // Especifica que la respuesta es un Blob (archivo binario)
    });
  }


//   servicios de apis rest plantillas

  public getRowmachotes() {
    return this.http.get<any>(this.endpoint+ '/allmachote');
  }

  public GetProdPlantilla(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/cantidadplantilla', send);
  }

  public GetdataPlantilla(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/CargaDatosPlantilla', send);
  }

  public SetdataPlantilla(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/CrearPlantilla', send);
  }

  public PutDataPlantilla(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.put(this.endpoint + '/EditarPlantilla', send);
  }

  public SetEstadoPlantilla(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.put(this.endpoint + '/UpdateEstadoPlantilla', send);
  }

  public GetdataPlantillaFacturador(dato: any) {
    let datos = this.crypto.encryptData(dato);
    const send = { data: datos }
    return this.http.post(this.endpoint + '/CargaDatosPlantilla', send);
  }

}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EncryptionService } from '../../../shared/encryption.interceptor';
import { API_ENDPOINT } from '../../../shared/env/endpoints';
@Injectable({
  providedIn: 'root'
})
export class EndpointDash {
  protected endpoint: string = `${API_ENDPOINT}productos`;
  constructor(private http: HttpClient, private crypto: EncryptionService) { }

  public getAll(){
      return this.http.get<any>(this.endpoint+'/Analytics');
  }

  public getGrafic(){
    return this.http.get<any>(this.endpoint+'/Grafics');
  }


}

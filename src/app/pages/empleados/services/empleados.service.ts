import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { empleadosDto } from '../types/dto.interface';
@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  protected endpoint: string = 'http://localhost:3000/empleados'
  constructor(private http: HttpClient) { }

  public getAllEmpleados(){
      return this.http.get<empleadosDto>(this.endpoint);
  }
}

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItem, SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { empleadosDto } from './types/dto.interface';
import { EmpleadosService } from './services/empleados.service';
import { EncryptionService } from '../../shared/encryption.interceptor';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-empleados',
  imports: [TableModule,ButtonModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, 
    MultiSelectModule, SelectModule, CommonModule, ReactiveFormsModule, TagModule, ToggleSwitchModule,
    TooltipModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss'
})
export class EmpleadosComponent implements OnInit {
  usuarios!: empleadosDto[];
  statuses!: any[];
  loading: boolean = true;
  @ViewChild('dt2') dt2!: Table; // Definir la referencia correctamente
  private formBuilder = inject(FormBuilder);
  constructor(private serve: EmpleadosService, private crypto: EncryptionService){}

  // Declaracion de formulario reactivo
  form = this.formBuilder.group({
    buscar: [''],
    checked: ['']
  });

  ngOnInit(): void {
    this.getData();
    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' }
  ];
  }

  private getData(){
    this.serve.getAllEmpleados().subscribe((res:any)=>{
      let response = this.crypto.decryptData(res)
      console.log(response.data);
      
      this.usuarios = response.data;
      this.loading = false;
    })
  }

  clear(table: Table) {
    table.clear();
    this.form.reset();
  }


  searchGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }
  
  getSeverity(status: boolean) {
        switch (status) {
            case true:
                return 'success';
            case false:
                return 'warn';
        }
  }


  getStatusNombre(status: boolean) {
    switch (status) {
        case true:
            return 'Activo';
        case false:
            return 'Inactivo';
    }
  }


formatFecha(fechaStr: string): Date | null {
  // Se asume que el formato es: HH:mm:ss.SSSSSS-OF
  // Necesitamos extraer HH:mm:ss, los primeros 3 dígitos de milisegundos y el offset.
  const regex = /^(\d{2}:\d{2}:\d{2})\.(\d{3})\d*(-\d{2})$/;
  const match = fechaStr.match(regex);

  if (match) {
    const timePart = match[1];      // Ej: "21:21:18"
    const millis = match[2];        // Ej: "137"
    const offsetHour = match[3];    // Ej: "-05"
    // Se asume que el offset es en horas y se fija minutos en "00"
    const isoString = `1970-01-01T${timePart}.${millis}${offsetHour}:00`;
    return new Date(isoString);
  }

  return null;
}
  
  
}

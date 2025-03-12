import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Md5 } from 'ts-md5';
import { CustomValidators } from '../../shared/validator/validators';
import { ClienteService } from './services/clientes.service';
import { EncryptionService } from '../../shared/encryption.interceptor';
import { clientesDto } from './types/dto.interface';

@Component({
  selector: 'app-clientes',
  imports: [TableModule, ButtonModule, TagModule, IconFieldModule, InputTextModule, InputIconModule,
      MultiSelectModule, SelectModule, CommonModule, ReactiveFormsModule, TagModule, ToggleSwitchModule,
      TooltipModule, DialogModule,ToastModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
  providers: [MessageService]
})
export class ClientesComponent implements OnInit {
  usuarios!: clientesDto[]; 
  
  loading: boolean = true;
  visible: boolean = false;
  @ViewChild('dt2') dt2!: Table; // Definir la referencia correctamente
  private formBuilder = inject(FormBuilder);
  TituloForm: string = "";
  errorMessages: Record<string, string> = {
    required: 'El campo es obligatorio',
    whitespace: 'No se permiten espacios en blanco',
    minlength: 'Mínimo 8 caracteres',
    email: 'El correo no es válido',
    firstLetterUppercase: 'La primera letra debe ser mayúscula',
    uppercaseStart: 'La contraseña debe comenzar con mayúscula',
    requiresNumber: 'Debe contener al menos un número',
    requiresSpecialChar: 'Debe incluir al menos un carácter especial',
  };
  
  
    roles = [
      {id:1, nombre:'Administrador'},
      {id:2, nombre:'Empleado'}
    ]
    
    constructor(private serve: ClienteService, private messageService: MessageService, private crypto: EncryptionService) { }
  
    // Declaracion de formulario reactivo
    form = this.formBuilder.group({
    id: [''],
    buscar: [''],
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.noWhitespaceValidator,
      CustomValidators.firstLetterUppercase
    ]],
    papellido: ['', [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.noWhitespaceValidator,
      CustomValidators.firstLetterUppercase
    ]],
    sapellido: ['', [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.noWhitespaceValidator,
      CustomValidators.firstLetterUppercase
    ]],
    pass: ['', [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.passwordValidator // Validador personalizado
    ]],
    passcryto: [''],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['', Validators.required],
    usuario: [''],
    estado: [false] 
    });
  
    ngOnInit(): void {
      this.getData();
    }
  
    private getData() {
      this.serve.getAll().subscribe((res: any) => {
        let response = this.crypto.decryptData(res);
        console.log('info usu', response);
        
        this.usuarios = response.data;
        this.loading = false;
      });

  
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
  
    formModal(titulo: string, data?: any): void {
      console.log(data, titulo);
      
      this.TituloForm = titulo;
      this.visible = !this.visible;
      if (titulo === 'Editar empleado') {
        setTimeout(() => {
          this.form.patchValue({
            id: data?.id,
            nombre: data?.nombre,
            papellido: data?.apellido1,
            sapellido: data?.apellido2,
            rol: data?.rol,
            correo: data?.correo,
            usuario: data?.usuario
          });
        }, 0);
      }else{
        this.form.reset();
      }
      
    }
  
    onCrearEmpleado(): void {
      
      console.log(this.form.value);
  
      this.serve.SetUser(this.form.value).subscribe((res)=>{
        let response = this.crypto.decryptData(res);
        if (response.Status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
          this.visible = false;
          this.form.reset();
          this.getData();
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
        }
      });
    }
  
    onEditarEmpleado(): void {
      console.log(this.form.value);
      this.form.patchValue({ passcryto: Md5.hashStr(this.form.value.pass || '') });
  
      this.serve.PutUser(this.form.value).subscribe((res)=>{
        let response = this.crypto.decryptData(res);
        if (response.Status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
          this.visible = false;
          this.form.reset();
          this.getData();
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
        }
      });
    }
    public mensajeError(campo: string, error: string): boolean {
      const control = this.form.get(`${campo}`);
      return (
        control! && control.hasError(error) && (control.dirty || control.touched)
      );
    }
    
    getFieldErrors(fieldName: string): string[] {
      const control = this.form.get(fieldName);
      if (!control || !control.errors || (!control.touched && !control.dirty)) return [];
    
      return Object.keys(control.errors)
        .filter(error => this.errorMessages[error])
        .map(error => this.errorMessages[error]);
    }
  

  
    getEstadoControl(datos: any): FormControl {
      return new FormControl(datos.estado);
    }
    
    onEstadoChange(datos: any) {
      datos.estado = !datos.estado;
      console.log(`Nuevo estado de :`,datos, datos.estado);
  
      this.serve.SetEstado(datos).subscribe((res: any)=>{
        let response = this.crypto.decryptData(res);
        if (response.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
          this.visible = false;
          this.form.reset();
          this.getData();
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
        }
      });
  
  
    }
   

}

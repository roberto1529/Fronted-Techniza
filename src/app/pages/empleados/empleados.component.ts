import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { empleadosDto, usuarioDto } from './types/dto.interface';
import { EmpleadosService } from './services/empleados.service';
import { EncryptionService } from '../../shared/encryption.interceptor';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CustomValidators } from '../../shared/validator/validators';
import { Md5 } from 'ts-md5';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-empleados',
  imports: [TableModule, ButtonModule, TagModule, IconFieldModule, InputTextModule, InputIconModule,
    MultiSelectModule, SelectModule, CommonModule, ReactiveFormsModule, TagModule, ToggleSwitchModule,
    TooltipModule, DialogModule,ToastModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss',
  providers: [MessageService]
})
export class EmpleadosComponent implements OnInit {
  usuarios!: empleadosDto[];
  usuarios_sys!:usuarioDto[];
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
  
  constructor(private serve: EmpleadosService, private crypto: EncryptionService, private messageService: MessageService) { }

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
    this.form.get('nombre')?.valueChanges.subscribe(() => this.generarUsuario());
    this.form.get('papellido')?.valueChanges.subscribe(() => this.generarUsuario());

  }

  private getData() {
    this.serve.getAllEmpleados().subscribe((res: any) => {
      let response = this.crypto.decryptData(res);
      console.log('info usu', response);
      
      this.usuarios = response.data;
      this.loading = false;
    });


    this.serve.getAllUsarios().subscribe((res: any)=>{
      let response = this.crypto.decryptData(res)
      this.usuarios_sys = response.data;      
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

  formModal(titulo: string, data?: empleadosDto): void {
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
    this.form.patchValue({ passcryto: Md5.hashStr(this.form.value.pass || '') });
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

  generarUsuario() {
    const nombre = this.form.get('nombre')?.value?.trim();
    const papellido = this.form.get('papellido')?.value?.trim();
  
    if (!nombre || !papellido) {
      this.form.patchValue({ usuario: '' });
      return;
    }
  
    const inicialNombre = nombre.charAt(0).toLowerCase();
    const baseUsuario = `${inicialNombre}${papellido.toLowerCase()}`;
  
    let nuevoUsuario = baseUsuario;
    let contador = 1;
  
    while (this.usuarios_sys.some(u => u.usuario === nuevoUsuario)) {
      nuevoUsuario = `${baseUsuario}${contador}`;
      contador++;
    }
  
    this.form.patchValue({ usuario: nuevoUsuario });
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

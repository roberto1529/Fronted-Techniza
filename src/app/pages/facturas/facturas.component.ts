import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { EncryptionService } from '../../shared/encryption.interceptor';
import { CustomValidators } from '../../shared/validator/validators';

@Component({
  selector: 'app-facturas',
  imports: [TableModule, ButtonModule, TagModule, IconFieldModule, InputTextModule, InputIconModule,
      MultiSelectModule, SelectModule, CommonModule, ReactiveFormsModule, TagModule, ToggleSwitchModule,
      TooltipModule, DialogModule, ToastModule, InputNumberModule],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss',
  providers: [MessageService]
})
export class FacturasComponent {
  datos!: any[];
 empleadoInfo: any = localStorage.getItem('token'); 
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
    pattern: 'Solo se permiten números',
  };

  constructor(private messageService: MessageService, private crypto: EncryptionService) { }

  // Declaracion de formulario reactivo
  form = this.formBuilder.group({
    id: [''],
    buscar: [''],
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+( [A-Za-zÁÉÍÓÚáéíóúñÑ]+)*$/),
      CustomValidators.firstLetterUppercase
    ]],
    telefono: [null, [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[0-9]+$/),
      CustomValidators.noWhitespaceValidator,
    ]],
    direccion: ['', [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.noWhitespaceValidator,
    ]],
    pais: ['', [
      Validators.required,
    ]],
    ciudad: ['', [
      Validators.required,
    ]],
    codpostal: ['', [
      Validators.minLength(3),
      Validators.required,
    ]],
    rfc: ['', [
      Validators.minLength(3),
      Validators.required,
    ]],
    empresa: ['', [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.noWhitespaceValidator,
      CustomValidators.firstLetterUppercase
    ]],
    correo: ['', [Validators.required, Validators.email]],
    idempleado: [''],
    estado: [false]
  });

  ngOnInit(): void {
    this.getData();
    this.empleadoInfo = this.crypto.decryptData(this.empleadoInfo);
    this.empleadoInfo = this.empleadoInfo?.data.data.datos[0];
  }

  private getData() {
    // this.serve.getAll().subscribe((res: any) => {
    //   let response = this.crypto.decryptData(res);
    //   this.loading = false;
    // });


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

    this.TituloForm = titulo;
    this.visible = !this.visible;
    if (titulo === 'Editar cliente') {
      setTimeout(() => {
      
        this.form.patchValue({
          id: data?.id,
          nombre: data.nombre,
          telefono: data.telefono,
          correo: data.correo,
          ciudad: data.id_ciudad,
          pais: data?.id_pais,
          empresa: data.empresa,
          direccion: data.direccion,
          rfc: data.rfc,
          codpostal: data.codigo_postal
        });
      }, 0);
    } else {
      this.form.reset();
    }

  }

  public onCrear(): void {
    console.log(this.form.value);

    // this.serve.SetUser(this.form.value).subscribe((res) => {
    //   let response = this.crypto.decryptData(res);
    //   if (response.Status === 200) {
    //     this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
    //     this.visible = false;
    //     this.form.reset();
    //     this.getData();
    //   } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
    //   }
    // });
  }

  public onEditar(): void {
    console.log(this.form.value);

    // this.serve.PutUser(this.form.value).subscribe((res) => {
    //   let response = this.crypto.decryptData(res);
    //   if (response.Status === 200) {
    //     this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
    //     this.visible = false;
    //     this.form.reset();
    //     this.getData();
    //   } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
    //   }
    // });
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
    // this.serve.SetEstado(datos).subscribe((res: any) => {
    //   let response = this.crypto.decryptData(res);
    //   if (response.status === 200) {
    //     this.messageService.add({ severity: 'success', summary: 'Correcto', detail: response.data });
    //     this.visible = false;
    //     this.form.reset();
    //     this.getData();
    //   } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor verificar la información diligenciada.' });
    //   }
    // });
  }
  

}

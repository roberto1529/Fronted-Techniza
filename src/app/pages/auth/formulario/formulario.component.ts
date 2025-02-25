import { Component, OnDestroy, OnInit } from '@angular/core';
import {  AbstractControl,  FormBuilder,  FormControl,  FormGroup,  ReactiveFormsModule,  ValidationErrors,  Validators,} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputOtpModule } from 'primeng/inputotp';
import { Router } from '@angular/router';
import { FormularioService } from './services/formulario.service';
import { Md5 } from 'ts-md5';

import { RespondeAuth, UserInfoAuth } from './types/responses.interfaces';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import * as data from '../data/lang.json'
import { EncryptionService } from '../../../shared/encryption.interceptor';

@Component({
  selector: 'sub-app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputOtpModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',
  providers: [MessageService],
})
export class FormularioComponent implements OnInit  {
  fb: FormGroup;
  icons: string = 'pi pi-moon';
  severity: | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined = 'secondary';
  isPassword = true;
  eyeIcons: string = 'pi pi-eye'
  visible: boolean = false;
  timeLeft: number = 5 * 60; // 5 minutos en segundos
  timer: any;
  formattedTime: string = '';
  Data: any;
  UserInfo!: UserInfoAuth;
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private service: FormularioService,
    private cto: EncryptionService,
    private msjServices: MessageService
  ) {
    this.fb = this.formBuilder.group({
      usuario: ['', [
        Validators.required,
        Validators.minLength(3),
        this.noWhitespaceValidator // Validador personalizado para espacios
      ]],
      id_user:[],
      pass: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator // Validador personalizado
      ]],
      passcryto: [],
      // email: ['', [Validators.required, Validators.email]],
      token: [],
    });
  }

  ngOnInit(): void {
    this.Data = data;
    console.log('Datos Js', this.Data.es);

  }

  // Validador personalizado para espacios en blanco
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;

    if (!value) return null;

    // Verifica si hay espacios en cualquier posición
    const hasWhitespace = /\s/.test(value);

    return hasWhitespace ? { whitespace: true } : null;
  }
  // Función de validación personalizada
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const validationErrors: ValidationErrors = {};

    // 1. Primera letra mayúscula
    if (!/^[A-Z]/.test(value)) {
      validationErrors['uppercaseStart'] = true;
    }

    // 2. Al menos un número
    if (!/\d/.test(value)) {
      validationErrors['requiresNumber'] = true;
    }

    // 3. Al menos un carácter especial (puedes modificar estos símbolos)
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
      validationErrors['requiresSpecialChar'] = true;
    }

    // 4. Mínimo 8 caracteres (ya cubierto por Validators.minLength(8))

    return Object.keys(validationErrors).length > 0 ? validationErrors : null;
  }

  public mensajeError(campo: string, error: string): boolean {
    const control = this.fb.get(`${campo}`);
    return (
      control! && control.hasError(error) && (control.dirty || control.touched)
    );
  }

  private ToastAlert(severity: string, summary: string,  detail?: any, sticky?: boolean
  ) {
    this.msjServices.clear();
    this.msjServices.add({
      severity: `${severity}`,
      summary: `${summary}`,
      detail: `${detail}`,
      sticky: sticky,
    });
  }

  public ViewPassword(): void{
    this.isPassword = !this.isPassword;
    if (this.isPassword === false) {
      this.eyeIcons = 'pi pi-eye-slash'
    }else{
      this.eyeIcons  = 'pi pi-eye'
    }
  }

  public onSubmit(): void {
    let error: boolean = false;

    for (const control in this.fb.controls) {
      const controls = this.fb.get(control) as FormControl;
      if (controls && controls.invalid) {
        controls.markAsTouched();
        error = true;
        this.ToastAlert(
          'error',
          'Error',
          'Por favor verique usuario y/o clave ingresados',
          false
        );
      }
    }

    if (error) {
      return;
    }

    //lanzamos peticion al servidor
    this.fb.patchValue({ passcryto: Md5.hashStr(this.fb.value.pass) });

    this.ManagerPeticioneAuth();
    this.startCountdown();
  /*   if (this.fb.value.usuario ==='rmol' && this.fb.value.pass ==='123456') {
          this._router.navigate(['/modulos']);
             console.log(this.fb.value);
    } */
  }

  private ManagerPeticioneAuth(): void{
      this.service.Auth_Service(this.fb.value).subscribe((res: RespondeAuth) => {
        let response = this.cto.decryptData(res);
        const { id, correo, usuario } = response.data[0];
        console.log('Respuesta servidor =>', response);
        this.UserInfo = {
          usuario: usuario,
          id: id,
          correo: correo
        }

        if (response.status === 200) {
          this.ToastAlert(
            'info',
            `Hola ${usuario},  Hemos enviado tu clave dinamica a tu correo, Por favor ingresa la clave enviada.`,
            false
          );
          this.fb.patchValue({ id_user: id });
          this.fb.get('token')?.reset();
          this.visible = true;

        }else{
          this.ToastAlert(
            'error',
            'Error de autenticacion',
            response.data,
            false
          );
          this.visible = false;
          this.fb.reset();
        }

      });
  }

  public onValueOtp(): void{

    this.service.Auth_Validar_token(this.fb.value).subscribe((res)=>{
        let response = this.cto.decryptData(res);
        console.log('Respueta de token',response);

    })

  }


  startCountdown() {
    // Detener cualquier temporizador previo
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Establecer el tiempo restante a 5 minutos (300 segundos)
    this.timeLeft = 300;

    this.updateFormattedTime(); // Actualiza el tiempo formateado inicialmente

    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.fb.get('token')?.enable(); // Habilitar el token
        this.updateFormattedTime();
      } else {
        this.fb.get('token')?.disable(); // Deshabilitar el token
        clearInterval(this.timer); // Detener el temporizador cuando llegue a 0
      }
    }, 1000);
  }


  updateFormattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


}

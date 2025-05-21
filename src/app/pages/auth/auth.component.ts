import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario/formulario.component';
import { SliderComponent } from "./slider/slider.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ButtonModule, FloatLabelModule, IconFieldModule, InputIconModule,
    DatePickerModule, InputOtpModule, CommonModule, FormularioComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  icons:string= "pi pi-moon";
  severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined = 'secondary';
  theme: string='';

  constructor(){}


  ngOnInit(): void {}


}

import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-slider',
  standalone: true,
  imports: [ButtonModule, FloatLabelModule,IconFieldModule,InputIconModule,
    DatePickerModule, InputOtpModule, CommonModule, ],
    template: `
    <div class="bg-cover bg-center creativeBox" [ngClass]="{'customerBGntg': theme === 'primeone-dark', 'customerBGday': theme !== 'primeone-dark'}">
    <div class="container">
      <div class="card-item cristal">1</div>
      <div class="card-item cristal">2</div>
      <div class="card-item cristal">3</div>
      <div class="card-item cristal">4</div>
      <div class="card-item cristal">5</div>
      <div class="card-item cristal">6</div>
      <br><br><br><br>
    </div>
  </div>

    `,
  styleUrl: '../auth.component.scss',
})
export class SliderComponent implements OnInit {
  icons:string= "pi pi-moon";
  severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined = 'secondary';
  theme: string='';

  constructor(){

  }



  ngOnInit(): void {}




}

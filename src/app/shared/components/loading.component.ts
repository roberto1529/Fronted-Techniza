// src/app/core/components/global-loading/global-loading.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../services/loading.service';


@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="global-loading-overlay" *ngIf="loadingService.loading$ | async">
      <div class="loading-content">
        <p-progressSpinner 
          styleClass="custom-spinner"
          strokeWidth="4"
          animationDuration=".5s"
          ariaLabel="loading"></p-progressSpinner>
      </div>
    </div>
  `,
  styles: [`
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      pointer-events: none;
    }
    
    :host ::ng-deep .custom-spinner .p-progress-spinner-circle {
      animation: p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-color 3s ease-in-out infinite;
      stroke-linecap: round;
    }

    @keyframes p-progress-spinner-color {
      0%, 100% {
        stroke: #ff6161;
      }
      50% {
        stroke: #00ACEF;
      }
    }
  `]
})
export class GlobalLoadingComponent {
  loadingService = inject(LoadingService);
}
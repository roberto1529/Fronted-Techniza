import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalLoadingComponent  } from './app/shared/components/loading.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule,RouterModule, GlobalLoadingComponent ],
    template: `<router-outlet></router-outlet> 
                <app-global-loading></app-global-loading>`
})
export class AppComponent {}

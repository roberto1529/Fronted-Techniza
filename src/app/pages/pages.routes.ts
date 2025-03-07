import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { EmpleadosComponent } from './empleados/empleados.component';

export default [

    { path: 'empleados', component: EmpleadosComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

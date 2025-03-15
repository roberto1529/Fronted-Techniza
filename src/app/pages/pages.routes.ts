import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';

export default [

    { path: 'empleados', component: EmpleadosComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';

export default [

    { path: 'empleados', component: EmpleadosComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'productos', component: ProductosComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

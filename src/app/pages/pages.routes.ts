import { Routes } from '@angular/router';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { FacturasComponent } from './facturas/facturas.component';
import { ComboxComponent } from './combox/combox.component';

export default [

    { path: 'empleados', component: EmpleadosComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'facturas', component: FacturasComponent },
    { path: 'facturas/:id', component: FacturasComponent },
    { path: 'machotes', component: ComboxComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

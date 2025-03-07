import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/pages/auth/guard/auth.guard';

export const appRoutes: Routes = [
    {
        path: 'dash',
        component: AppLayout,
        canActivate: [AuthGuard], // Protege todas las rutas hijas de 'dash'
        children: [
            { path: '', component: Dashboard },
            { path: 'modulo', loadChildren: () => import('./app/pages/pages.routes').then(m => m.default) }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes').then(m => m.default) },
    { path: '', redirectTo: '/auth', pathMatch: 'full' }, // Redirige a la autenticación por defecto
    { path: '**', redirectTo: '/notfound' } // Captura rutas inválidas
];

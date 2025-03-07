import { Routes } from '@angular/router';
// import { Access } from './access';
import { AuthComponent } from './auth.component';
import { Error } from '../errors/error';
import { AuthGuard } from './guard/auth.guard';

export default [
    // { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', canActivate: [AuthGuard],  component: AuthComponent },
    { path: '', component: AuthComponent },

] as Routes;

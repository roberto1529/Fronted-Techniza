import { Routes } from '@angular/router';
// import { Access } from './access';
import { AuthComponent } from './auth.component';
import { Error } from '../auth_/error';

export default [
    // { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: AuthComponent }
] as Routes;

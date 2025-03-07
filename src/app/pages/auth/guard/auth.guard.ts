import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('token'); // Cambia esto según tu lógica de autenticación

    if (!isAuthenticated) {
      this.router.navigate(['auth/login']);
      return false;
    }
    
    return true;
  }
}

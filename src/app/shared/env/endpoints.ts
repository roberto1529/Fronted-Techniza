// endpoints.ts
import { isDevMode } from '@angular/core';

export const API_ENDPOINT = isDevMode() 
  ? 'http://localhost:3000/'       // Ruta para desarrollo
  : 'http://admin.techniza.mx:3000/'; // Ruta para producción

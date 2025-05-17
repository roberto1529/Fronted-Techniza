// endpoints.ts
import { isDevMode } from '@angular/core';

export const API_ENDPOINT = isDevMode()
  ? 'http://localhost:3000/'       // Ruta para desarrollo
  : 'https://admin.techniza.mx:3000/'; // Ruta para producción

  export const API_ENDPOINT_REPORT = isDevMode()
//   ? 'http://localhost:8000/'       // Ruta para desarrollo
//   :
  'https://admin.techniza.mx:8000/'; // Ruta para producción

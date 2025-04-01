// src/app/core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Excluir ciertas peticiones
  if (req.url.includes('assets/') || req.url.includes('.json')) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
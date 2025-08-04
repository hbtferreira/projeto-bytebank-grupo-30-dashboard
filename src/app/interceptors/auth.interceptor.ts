import { inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

import { from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authWrapper = inject(SharedAuthServiceWrapper);
  return from(authWrapper.getToken()).pipe(
    switchMap(token => {
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
      }
      return next(req);
    }),
    catchError(error => {
      console.error('Erro ao obter token:', error);
      return next(req);
    })
  );
};

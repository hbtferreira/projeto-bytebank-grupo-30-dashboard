import { inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

import { from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authWrapper = inject(SharedAuthServiceWrapper);

  // Função para obter token com fallback
  const getTokenWithFallback = async (): Promise<string | null> => {
    try {
      // Tenta obter token através do authWrapper
      if (authWrapper) {
        const token = await authWrapper.getToken();
        if (token) {
          return token;
        }
      }
    } catch (error) {
      console.warn('Erro ao obter token via authWrapper, tentando localStorage:', error);
    }

    // Fallback: tenta recuperar do localStorage
    try {
      const token = localStorage.getItem('authToken');
      return token;
    } catch (localStorageError) {
      console.error('Erro ao obter token do localStorage:', localStorageError);
      return null;
    }
  };

  return from(getTokenWithFallback()).pipe(
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
      console.error('Erro no interceptor de autenticação:', error);
      return next(req);
    })
  );
};

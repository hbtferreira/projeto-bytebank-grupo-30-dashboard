import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteModuleGuard implements CanActivate {
  constructor(
    private authService: SharedAuthServiceWrapper,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Se já está inicializado, permitir acesso
    if (this.authService.isModuleInitialized()) {
      return of(true);
    }

    // Aguardar inicialização
    return from(this.authService.waitForInitialization()).pipe(
      map(() => {
        return this.authService.isModuleInitialized();
      }),
      catchError((error) => {
        console.error('Erro ao carregar módulo remoto no guard:', error);
        // Mesmo com erro, permitir acesso (fallback funcionará)
        return of(true);
      })
    );
  }
}

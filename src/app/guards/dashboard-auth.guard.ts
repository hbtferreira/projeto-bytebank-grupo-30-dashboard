import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardAuthGuard implements CanActivate {
  constructor(
    private authWrapper: SharedAuthServiceWrapper,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const isAuthenticated = await this.authWrapper.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }

    // Redirecionar para o shell/home se não autenticado
    window.location.href = '/home';
    return false;
  }
}

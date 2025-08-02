# Exemplo de Uso do Sistema de Autenticação Aprimorado no Dashboard

## Overview

O sistema agora oferece uma arquitetura robusta de gerenciamento de estado com:
- Sincronização automática entre microfrontends
- Sistema de eventos em tempo real
- Fallbacks para garantir funcionamento mesmo se o shell falhar
- Observables reativas para mudanças de estado

## Como Usar no Dashboard

### 1. Importar e Injetar o Serviço

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
    <div *ngIf="authState?.isAuthenticated">
      <h1>Bem-vindo, {{ authState.user?.username }}!</h1>
      <p>Email: {{ authState.user?.email }}</p>
      <p>Última atividade: {{ authState.lastActivity | date:'medium' }}</p>
      <button (click)="logout()">Sair</button>
      <button (click)="updateActivity()">Atualizar Atividade</button>
    </div>
    <div *ngIf="!authState?.isAuthenticated && !isLoading">
      <p>Não autenticado. Redirecionando...</p>
    </div>
    <div *ngIf="isLoading">
      <p>Carregando...</p>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  authState: any = null;
  isLoading = true;
  private subscriptions = new Subscription();

  constructor(private authWrapper: SharedAuthServiceWrapper) {}

  async ngOnInit() {
    await this.initializeAuth();
    this.setupAuthListeners();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private async initializeAuth() {
    try {
      // Verificar se está autenticado
      const isAuthenticated = await this.authWrapper.isAuthenticated();
      
      if (isAuthenticated) {
        // Obter dados do usuário
        this.authState = {
          isAuthenticated,
          user: await this.authWrapper.getCurrentUser(),
          token: await this.authWrapper.getToken(),
          lastActivity: Date.now()
        };
      } else {
        // Não autenticado, redirecionar
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      // Fallback - tentar localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/home';
      }
    } finally {
      this.isLoading = false;
    }
  }

  private setupAuthListeners() {
    // Escutar mudanças no estado de autenticação
    const authSub = this.authWrapper.authState$.subscribe(state => {
      this.authState = state;
      if (state && !state.isAuthenticated) {
        // Usuário fez logout, redirecionar
        window.location.href = '/home';
      }
    });

    // Escutar evento de logout específico
    const logoutSub = this.authWrapper.onAuthLogout().subscribe(() => {
      console.log('Logout detectado via event bus');
      window.location.href = '/home';
    });

    // Escutar expiração de sessão
    const expiredSub = this.authWrapper.onSessionExpired().subscribe(() => {
      console.log('Sessão expirada');
      alert('Sua sessão expirou. Você será redirecionado para a página inicial.');
      window.location.href = '/home';
    });

    this.subscriptions.add(authSub);
    this.subscriptions.add(logoutSub);
    this.subscriptions.add(expiredSub);
  }

  async logout() {
    try {
      await this.authWrapper.logout();
      window.location.href = '/home';
    } catch (error) {
      console.error('Erro no logout:', error);
      // Fallback
      localStorage.clear();
      window.location.href = '/home';
    }
  }

  async updateActivity() {
    try {
      await this.authWrapper.updateActivity();
      console.log('Atividade atualizada');
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
    }
  }
}
```

### 2. Uso em Componentes Filhos

```typescript
import { Component, OnInit } from '@angular/core';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

@Component({
  selector: 'app-header-dashboard',
  template: `
    <div class="header">
      <span *ngIf="user">Olá, {{ user.username }}</span>
      <button (click)="logout()">Sair</button>
    </div>
  `
})
export class HeaderDashboardComponent implements OnInit {
  user: any = null;

  constructor(private authWrapper: SharedAuthServiceWrapper) {}

  async ngOnInit() {
    // Obter usuário atual
    this.user = await this.authWrapper.getCurrentUser();
    
    // Escutar mudanças no usuário
    this.authWrapper.authState$.subscribe(state => {
      this.user = state?.user;
    });
  }

  async logout() {
    await this.authWrapper.logout();
  }
}
```

### 3. Guard de Rota Atualizado

```typescript
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
    try {
      const isAuthenticated = await this.authWrapper.isAuthenticated();
      
      if (isAuthenticated) {
        // Atualizar atividade ao navegar
        await this.authWrapper.updateActivity();
        return true;
      } else {
        window.location.href = '/home';
        return false;
      }
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      window.location.href = '/home';
      return false;
    }
  }
}
```

### 4. Interceptor HTTP Atualizado

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authWrapper: SharedAuthServiceWrapper) {}

  async intercept(req: HttpRequest<any>, next: HttpHandler) {
    try {
      const token = await this.authWrapper.getToken();
      
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authReq);
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    
    return next.handle(req);
  }
}
```

## Novos Recursos Disponíveis

### 1. Observables Reativas
```typescript
// Estado completo
this.authWrapper.authState$.subscribe(state => { /* ... */ });

// Apenas status de autenticação
this.authWrapper.isAuthenticated$.subscribe(isAuth => { /* ... */ });
```

### 2. Eventos Específicos
```typescript
// Login de outro microfrontend
this.authWrapper.onAuthLogin().subscribe(data => {
  console.log('Login detectado:', data);
});

// Logout de outro microfrontend
this.authWrapper.onAuthLogout().subscribe(() => {
  console.log('Logout detectado');
});

// Sessão expirada
this.authWrapper.onSessionExpired().subscribe(() => {
  console.log('Sessão expirou');
});
```

### 3. Métodos Utilitários
```typescript
// Verificar autenticação
const isAuth = await this.authWrapper.isAuthenticated();

// Obter usuário atual
const user = await this.authWrapper.getCurrentUser();

// Obter token
const token = await this.authWrapper.getToken();

// Atualizar atividade
await this.authWrapper.updateActivity();
```

## Benefícios da Nova Arquitetura

1. **Sincronização Automática**: Mudanças se propagam automaticamente
2. **Robustez**: Fallbacks garantem funcionamento mesmo com falhas
3. **Performance**: Caching inteligente e observables eficientes
4. **Debugging**: Logs detalhados para troubleshooting
5. **Flexibilidade**: Configurações personalizáveis
6. **Escalabilidade**: Preparado para novos microfrontends

## Troubleshooting

### Problema: Estado não sincroniza
```typescript
// Verificar se o EventBus está funcionando
console.log('EventBus disponível:', await this.authWrapper.getEventBus());
```

### Problema: Fallback não funciona
```typescript
// Verificar localStorage diretamente
const token = localStorage.getItem('authToken');
console.log('Token direto:', token);
```

### Problema: Performance lenta
```typescript
// Configurar strategy de storage
// (implementar no SharedAuthService se necessário)
this.authService.configure({
  storageStrategy: 'sessionStorage' // mais rápido
});
```

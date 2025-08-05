import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Observable, BehaviorSubject, fromEvent, of, from } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  lastActivity: number;
  expiresAt: number | null;
}

export interface MicrofrontendEvent {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedAuthServiceWrapper {
  private sharedAuthService: any;
  private eventBus: any;
  private authStateSubject = new BehaviorSubject<AuthState | null>(null);
  private initializationPromise: Promise<any> | null = null;
  private isInitialized = false;

  public authState$ = this.authStateSubject.asObservable();
  public isAuthenticated$ = this.authState$.pipe(
    map(state => state?.isAuthenticated || false)
  );

  constructor() {
    this.setupEventListeners();
    // Iniciar o carregamento do módulo remoto imediatamente
    this.initializationPromise = this.initializeRemoteModule();
  }

  private setupEventListeners(): void {
    // Escutar eventos de microfrontend
    fromEvent<CustomEvent>(window, 'microfrontend-event').pipe(
      filter(event => event.detail?.type?.startsWith('mf:auth')),
      map(event => event.detail as MicrofrontendEvent)
    ).subscribe(event => {
      this.handleAuthEvent(event);
    });

    // Escutar mudanças no localStorage
    fromEvent(window, 'storage').pipe(
      filter((event: any) => event.key === 'authToken' || event.key === 'authSession')
    ).subscribe(() => {
      this.syncStateFromStorage();
    });
  }

  private handleAuthEvent(event: MicrofrontendEvent): void {
    switch (event.type) {
      case 'mf:auth:login':
        this.authStateSubject.next({
          isAuthenticated: true,
          user: event.data.user,
          token: event.data.token,
          lastActivity: Date.now(),
          expiresAt: this.extractExpirationFromToken(event.data.token)
        });
        break;

      case 'mf:auth:logout':
        this.authStateSubject.next({
          isAuthenticated: false,
          user: null,
          token: null,
          lastActivity: Date.now(),
          expiresAt: null
        });
        break;

      case 'mf:auth:change':
        this.authStateSubject.next(event.data);
        break;
    }
  }

  private syncStateFromStorage(): void {
    try {
      const sessionJson = localStorage.getItem('authSession');
      if (sessionJson) {
        const sessionData = JSON.parse(sessionJson);
        this.authStateSubject.next({
          isAuthenticated: sessionData.isAuthenticated,
          user: sessionData.user,
          token: sessionData.token,
          lastActivity: sessionData.lastActivity,
          expiresAt: sessionData.expiresAt
        });
      } else {
        // Fallback para formato antigo
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('authUser');

        if (token) {
          const user = userJson ? JSON.parse(userJson) : null;
          this.authStateSubject.next({
            isAuthenticated: true,
            user,
            token,
            lastActivity: Date.now(),
            expiresAt: this.extractExpirationFromToken(token)
          });
        } else {
          this.authStateSubject.next({
            isAuthenticated: false,
            user: null,
            token: null,
            lastActivity: Date.now(),
            expiresAt: null
          });
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar estado do storage:', error);
    }
  }

  private async initializeRemoteModule(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const module = await loadRemoteModule({
        remoteEntry: environment.shell.remoteEntry,
        remoteName: environment.shell.remoteName,
        exposedModule: './shared-auth'
      });

      // Verificar se a função factory existe
      if (!module.createSharedAuthService) {
        throw new Error('createSharedAuthService function not found in module');
      }

      // Usar função factory ao invés de new
      this.sharedAuthService = module.createSharedAuthService();

      // Verificar se o serviço foi criado corretamente
      if (!this.sharedAuthService.auth$) {
        throw new Error('SharedAuthService not properly initialized');
      }

      // Verificar se a função factory do EventBus existe
      if (module.createMicrofrontendEventBus) {
        this.eventBus = module.createMicrofrontendEventBus();
      }

      // Sincronizar estado inicial
      const currentState = this.sharedAuthService.getStateSnapshot();
      if (currentState) {
        this.authStateSubject.next(currentState);
      }

      // Subscrever para mudanças
      this.sharedAuthService.auth$.subscribe((state: AuthState) => {
        this.authStateSubject.next(state);
      });

      this.isInitialized = true;
      console.log('Módulo remoto inicializado com sucesso');

    } catch (error) {
      console.error('Erro ao inicializar módulo remoto:', error);
      // Fallback para sincronização via storage
      this.syncStateFromStorage();
      this.isInitialized = false;
    }
  }

  async getSharedAuthService() {
    // Aguardar a inicialização do módulo remoto
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    if (!this.sharedAuthService && !this.isInitialized) {
      // Tentar inicializar novamente se falhou na primeira vez
      await this.initializeRemoteModule();
    }

    return this.sharedAuthService;
  }

  async getEventBus() {
    // Aguardar a inicialização do módulo remoto
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    if (!this.eventBus && !this.isInitialized) {
      // Tentar inicializar novamente se falhou na primeira vez
      await this.initializeRemoteModule();
    }

    return this.eventBus;
  }

  async login(token: string, user?: any) {
    try {
      const authService = await this.getSharedAuthService();
      authService.login(token, user);
    } catch (error) {
      console.error('Erro no login:', error);
      // Fallback
      localStorage.setItem('authToken', token);
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
      }
      this.syncStateFromStorage();
    }
  }

  async logout() {
    try {
      const authService = await this.getSharedAuthService();
      authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
      // Fallback
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('authSession');
      this.authStateSubject.next({
        isAuthenticated: false,
        user: null,
        token: null,
        lastActivity: Date.now(),
        expiresAt: null
      });
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const authService = await this.getSharedAuthService();
      return authService.isAuthenticated();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Fallback
      const currentState = this.authStateSubject.value;
      return currentState?.isAuthenticated || false;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const authService = await this.getSharedAuthService();
      return authService.getCurrentUser();
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      // Fallback
      const currentState = this.authStateSubject.value;
      return currentState?.user || null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const authService = await this.getSharedAuthService();
      return authService.getToken();
    } catch (error) {
      console.error('Erro ao obter token:', error);
      // Fallback
      const currentState = this.authStateSubject.value;
      return currentState?.token || null;
    }
  }

  async updateActivity(): Promise<void> {
    try {
      const authService = await this.getSharedAuthService();
      authService.updateActivity();
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
    }
  }

  async getAuthObservable(): Promise<Observable<AuthState | null>> {
    // Aguardar a inicialização do módulo remoto
    await this.waitForInitialization();
    return this.authState$;
  }

  // Método público para aguardar a inicialização
  async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    if (!this.isInitialized) {
      await this.initializeRemoteModule();
    }
  }

  // Método para verificar se está inicializado
  isModuleInitialized(): boolean {
    return this.isInitialized;
  }

  // Método para uso com forkJoin - retorna um Observable que completa quando o módulo está carregado
  getInitializationObservable(): Observable<boolean> {
    if (this.isInitialized) {
      return of(true);
    }

    return from(this.waitForInitialization()).pipe(
      map(() => this.isInitialized),
      catchError((error) => {
        console.error('Erro na inicialização do módulo remoto:', error);
        return of(false);
      })
    );
  }

  // Método para subscrever eventos específicos
  onAuthLogin(): Observable<any> {
    return fromEvent<CustomEvent>(window, 'microfrontend-event').pipe(
      filter(event => event.detail?.type === 'mf:auth:login'),
      map(event => event.detail.data)
    );
  }

  onAuthLogout(): Observable<any> {
    return fromEvent<CustomEvent>(window, 'microfrontend-event').pipe(
      filter(event => event.detail?.type === 'mf:auth:logout'),
      map(event => event.detail.data)
    );
  }

  onSessionExpired(): Observable<any> {
    return fromEvent<CustomEvent>(window, 'microfrontend-event').pipe(
      filter(event => event.detail?.type === 'mf:auth:session:expired'),
      map(event => event.detail.data)
    );
  }

  private extractExpirationFromToken(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}

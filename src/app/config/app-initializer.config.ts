import { APP_INITIALIZER } from '@angular/core';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';

export function initializeApp(authService: SharedAuthServiceWrapper) {
  return (): Promise<void> => {
    console.log('Inicializando aplicação - carregando módulo remoto...');
    return authService.waitForInitialization()
      .then(() => {
        console.log('Módulo remoto carregado com sucesso durante a inicialização da aplicação');
      })
      .catch((error) => {
        console.error('Erro ao carregar módulo remoto durante a inicialização:', error);
        // Não bloquear a inicialização da aplicação mesmo se houver erro
        return Promise.resolve();
      });
  };
}

export const APP_INITIALIZER_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [SharedAuthServiceWrapper],
    multi: true
  }
];

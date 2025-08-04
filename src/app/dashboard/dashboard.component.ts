import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { BalanceComponent } from './balance/balance.component';
import { ExtractComponent } from './extract/extract.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { MyCardsComponent } from './my-cards/my-cards.component';
import { OtherServicesComponent } from './other-services/other-services.component';
import { InvestmentsComponent } from './investments/investments.component';
import { SharedAuthServiceWrapper } from '../services/shared-auth-wrapper.service';
import { Card } from '../models/card.model';
import { Account } from '../models/account.model';
import { forkJoin, from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderDashboardComponent,
    MenuComponent,
    BalanceComponent,
    ExtractComponent,
    NewTransactionComponent,
    MyCardsComponent,
    OtherServicesComponent,
    InvestmentsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  customerName = '';
  selectedMenu = 'Início';
  cards: Card[] = [];
  account: Account | null = null;
  isLoading = true;

  constructor(
    private accountService: AccountService,
    public sharedAuthServiceWrapper: SharedAuthServiceWrapper,
  ) {}

  ngOnInit(): void {
    //this.initializeDashboard();
    this.initializeDashboardWithIndividualErrorHandling();
  }

  private initializeDashboard(): void {
    this.isLoading = true;

    // Usando forkJoin para executar as chamadas simultaneamente
    forkJoin({
      user: from(this.sharedAuthServiceWrapper.getCurrentUser()),
      accountData: this.accountService.find()
    }).pipe(
      catchError(error => {
        console.error('Erro ao carregar dados do dashboard:', error);

        // Retorna dados padrão em caso de erro para manter a aplicação funcionando
        return [{
          user: null,
          accountData: { message: '', result: { account: [], transactions: [], cards: [] } }
        }];
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        // Processar dados do usuário
        if (data.user) {
          this.customerName = data.user.username || 'Usuário';
        } else {
          console.warn('⚠️ Usuário não encontrado no Shared Auth Wrapper');
          this.customerName = 'Usuário';
        }

        // Processar dados da conta
        if (data.accountData?.result) {
          this.account = data.accountData.result.account?.[0];
          this.cards = data.accountData.result.cards || [];

          console.log('✅ Dados carregados com sucesso:', {
            user: data.user,
            account: this.account,
            cards: this.cards.length
          });
        }
      },
      error: (error) => {
        console.error('Erro crítico ao inicializar dashboard:', error);
        this.customerName = 'Usuário';
      }
    });
  }

  // Método alternativo com tratamento individual de erros
  private initializeDashboardWithIndividualErrorHandling(): void {
    this.isLoading = true;

    // Converter Promise para Observable
    const userRequest$ = from(this.sharedAuthServiceWrapper.getCurrentUser()).pipe(
      catchError(error => {
        console.error('Erro ao carregar usuário:', error);
        return [null]; // Retorna null em caso de erro
      })
    );

    // Chamada para dados da conta já é Observable
    const accountRequest$ = this.accountService.find().pipe(
      catchError(error => {
        console.error('Erro ao carregar conta:', error);
        return [{ message: 'Erro', result: { account: [], transactions: [], cards: [] } }];
      })
    );

    forkJoin({
      user: userRequest$,
      accountData: accountRequest$
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        // Processar dados com tratamento individual
        this.customerName = data.user?.username || 'Usuário';

        if (data.accountData?.result) {
          this.account = data.accountData.result.account?.[0];
          this.cards = data.accountData.result.cards || [];
        }

        console.log('✅ Inicialização completa:', {
          userLoaded: !!data.user,
          accountLoaded: !!this.account,
          cardsCount: this.cards.length
        });
      },
      error: (error) => {
        console.error('Erro na inicialização:', error);
      }
    });
  }

  onMenuSelected(label: string) {
    this.selectedMenu = label;
  }

  onLogoutSelected(): void {
    this.sharedAuthServiceWrapper.logout().catch((error) => {
      console.warn('⚠️ Erro no logout via Shared Auth:', error);
    });
  }
}

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
import { catchError, retry, switchMap, timeout } from 'rxjs/operators';

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
  maxRetries = 3;
  timeoutMs = 10000;

  constructor(
    private accountService: AccountService,
    public sharedAuthServiceWrapper: SharedAuthServiceWrapper,
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
  }

  private initializeDashboard(): void {
      this.isLoading = true;

      from(this.sharedAuthServiceWrapper.getCurrentUser()).pipe(
        timeout(this.timeoutMs),
        retry(this.maxRetries),
        switchMap(user => {
          return forkJoin({
            user: [user],
            accountData: this.accountService.find()
          });
        }),
        catchError(error => {
          console.error('Erro no carregamento sequencial:', error);
          return [{ user: null, accountData: null }];
        }),
      ).subscribe({
        next: (data) => {
          this.customerName = data.user?.username || 'Usuário';
          if (data.accountData?.result) {
            this.account = data.accountData.result.account?.[0];
            this.cards = data.accountData.result.cards || [];
          }
        },
        error: (error) => {
          console.error('⚠️ Erro na inicialização:', error);
        },
        complete: () => this.isLoading = false
      });
    }

  onMenuSelected(label: string) {
    this.selectedMenu = label;
  }

  onLogoutSelected(): void {
    this.sharedAuthServiceWrapper.logout().then(() => {
      window.location.href = '/';
    }).catch((error) => {
      console.warn('⚠️ Erro no logout via Shared Auth:', error);
    });
  }
}

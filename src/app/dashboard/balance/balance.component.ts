import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user.model';
import { SharedAuthServiceWrapper } from 'src/app/services/shared-auth-wrapper.service';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent implements OnInit {
  @Input() nome = '';
  @Input() accountId = '';
  saldo = 0;
  hoje = new Date();
  saldoVisivel = true;
  user: User = { id: '', username: '', email: '' };

  constructor(
    private accountService: AccountService,
    public sharedAuthServiceWrapper: SharedAuthServiceWrapper
  ) {
    this.sharedAuthServiceWrapper.getCurrentUser().then(user => this.user = user || { id: '', username: '', email: '' });
  }

  get nomeCurto() {
    return this.nome.split(' ')[0];
  }

  ngOnInit(): void {
    this.loadBalance();

    this.accountService.transactionsUpdated$.subscribe(() => {
      this.loadBalance();
    });
  }

  private loadBalance(): void {
    this.accountService.getStatement(this.accountId).subscribe({
      next: (response) => {
        const transactions = response.result.transactions;
        this.saldo = transactions.reduce((total: number, t: any) => total + t.value, 0);
      },
      error: (err: any) => console.error('Erro ao carregar saldo:', err),
    });
  }
}

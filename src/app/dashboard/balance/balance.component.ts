import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent implements OnInit {
  @Input() nome = '';
  saldo = 0;
  hoje = new Date();
  saldoVisivel = true;

  constructor(private transactionService: TransactionService) {}

  get nomeCurto() {
    return this.nome.split(' ')[0];
  }

  ngOnInit(): void {
    this.loadBalance();

    this.transactionService.transactionsUpdated$.subscribe(() => {
      this.loadBalance();
    });
  }

  private loadBalance(): void {
    this.transactionService.getBalance().subscribe({
      next: (balance) => (this.saldo = balance),
      error: (err) => console.error('Erro ao carregar saldo:', err),
    });
  }
}

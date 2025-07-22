import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss']
})
export class ExtractComponent implements OnInit {
  extrato: Transaction[] = [];
  filteredExtrato: Transaction[] = [];
  searchTerm: string = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();

    this.transactionService.transactionsUpdated$.subscribe(() => {
      this.loadTransactions();
    });
  }

  private loadTransactions(): void {
    this.transactionService.getByAccount().subscribe({
      next: (data) => {
        this.extrato = data;
        this.filteredExtrato = [...this.extrato];
      },
      error: (err) => console.error('Erro ao carregar extrato:', err),
    });
  }

  filterExtract(): void {
    if (!this.searchTerm.trim()) {
      this.filteredExtrato = [...this.extrato];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredExtrato = this.extrato.filter(item => 
      item.type.toLowerCase().includes(searchLower) ||
      item.value.toString().includes(searchLower) ||
      new Date(item.date).toLocaleDateString('pt-BR').includes(searchLower) ||
      new Date(item.date).toLocaleString('pt-BR', { month: 'long' }).toLowerCase().includes(searchLower)
    );
  }
}

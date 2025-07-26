import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-extract',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule
  ],
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

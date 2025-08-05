import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../../services/account.service';
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
  @Input() accountId = '';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadTransactions();

    this.accountService.transactionsUpdated$.subscribe(() => {
      this.loadTransactions();
    });
  }

  private loadTransactions(): void {
    this.accountService.getStatement(this.accountId).subscribe({
      next: (response) => {
        this.extrato = response.result.transactions;
        this.filteredExtrato = [...this.extrato];
      },
      error: (err: any) => console.error('Erro ao carregar extrato:', err),
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
      item.from.toLowerCase().includes(searchLower) ||
      item.to.toLowerCase().includes(searchLower) ||
      item.value.toString().includes(searchLower) ||
      new Date(item.date).toLocaleDateString('pt-BR').includes(searchLower) ||
      new Date(item.date).toLocaleString('pt-BR', { month: 'long' }).toLowerCase().includes(searchLower)
    );
  }
}

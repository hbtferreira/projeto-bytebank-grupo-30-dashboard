import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss'],
})
export class NewTransactionComponent {
  transactionType: string = 'DEPOSIT';
  amount: number = 0;
  fromField: string = '';
  toField: string = '';
  @Input() accountId = '';

  constructor(private accountService: AccountService) {}

  finishTransaction(): void {
    const transactionData = {
      accountId: this.accountId,
      type: this.transactionType,
      value: this.transactionType === 'TRANSFER' ? -Math.abs(this.amount) : this.amount,
      from: this.fromField || 'Conta Corrente',
      to: this.toField || 'Destino',
    };

    this.accountService.createTransaction(transactionData).subscribe({
      next: () => {
        console.log('Transação realizada com sucesso');
        this.accountService.updateTransactions();
      },
      error: (err: any) => console.error('Erro ao realizar transação:', err),
    });

    // Reset form
    this.amount = 0;
    this.transactionType = 'DEPOSIT';
    this.fromField = '';
    this.toField = '';
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionType } from '../../enums/transaction-type.enum';

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
  transactionType: TransactionType = TransactionType.DEPOSIT;
  amount: number = 0;

  constructor(private transactionService: TransactionService) {}

  finishTransaction(): void {
    const transaction: Omit<Transaction, 'type'> = {
      id: Math.random().toString(36).substring(2, 15),
      value: this.amount,
      date: new Date(),
    };

    if (this.transactionType === TransactionType.DEPOSIT) {
      this.transactionService.addMoney(transaction).subscribe({
        next: () => console.log('Entrada realizada com sucesso'),
        error: (err) => console.error('Erro ao realizar entrada:', err),
      });
    } else if (this.transactionType === TransactionType.TRANSFER) {
      this.transactionService.removeMoney(transaction).subscribe({
        next: () => console.log('Saída realizada com sucesso'),
        error: (err) => console.error('Erro ao realizar saída:', err),
      });
    } else {
      console.warn('Tipo de transação desconhecido');
    }

    this.amount = 0;
    this.transactionType = TransactionType.DEPOSIT;
  }
}

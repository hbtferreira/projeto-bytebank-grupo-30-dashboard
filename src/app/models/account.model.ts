import { Transaction } from './transaction.model';
import { Card } from './card.model';

export interface Account {
  id: string;
  type: string;
  userId: string;
}

export interface GetAccountResponse {
  account: Account[];
  transactions: Transaction[];
  cards: Card[];
}


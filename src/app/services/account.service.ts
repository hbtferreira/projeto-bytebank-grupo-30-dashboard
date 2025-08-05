import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account, GetAccountResponse } from '../models/account.model';
import { Transaction } from '../models/transaction.model';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService<Account> {
  private accountSubject = new BehaviorSubject<Account | null>(null);
  account$ = this.accountSubject.asObservable();

  // Lógica movida do TransactionService
  private transactionsUpdated = new Subject<void>();
  public transactionsUpdated$ = this.transactionsUpdated.asObservable();

  constructor(http: HttpClient) {
    super(http, 'account');
  }

  /**
   * GET /account
   * Busca a conta do usuário logado com transações e cartões
   * Baseado no método find do AccountController
   */
  find(): Observable<ApiResponse<GetAccountResponse>> {
    return this.http.get<ApiResponse<GetAccountResponse>>(`${this.baseUrl}/account`);
  }

  /**
   * DELETE /account/:id
   * Deleta uma conta
   * Baseado no método delete do AccountController
   * Nota: Este endpoint existe no controller mas não está definido nas rotas
   */
  deleteAccount(accountId: string): Observable<ApiResponse<Account>> {
    return this.http.delete<ApiResponse<Account>>(
      `${this.baseUrl}/account/${accountId}`
    );
  }

  /**
   * GET /account/:accountId/statement
   * Obtém extrato da conta
   * Baseado no método getStatement do AccountController
   */
  getStatement(accountId: string): Observable<ApiResponse<{ transactions: Transaction[] }>> {
    return this.http.get<ApiResponse<{ transactions: Transaction[] }>>(
      `${this.baseUrl}/account/${accountId}/statement`
    );
  }

  /**
   * POST /account/transaction
   * Cria uma nova transação
   * Baseado no método createTransaction do AccountController
   */
  createTransaction(transactionData: {
    accountId: string;
    value: number;
    type: string;
    from: string;
    to: string;
    anexo?: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(
      `${this.baseUrl}/account/transaction`,
      transactionData
    );
  }

  /**
   * DELETE /account/:accountId/transaction/:transactionId
   * Deleta uma transação específica
   * Baseado no método deleteTransactionById do AccountController
   */
  deleteTransaction(transactionId: string, accountId: string): Observable<ApiResponse<Transaction>> {
    return this.http.delete<ApiResponse<Transaction>>(
      `${this.baseUrl}/account/${accountId}/transaction/${transactionId}`
    );
  }

  /**
   * PUT /account/:accountId/transaction/:transactionId
   * Atualiza uma transação específica
   * Baseado no método updateTransactionById do AccountController
   */
  updateTransaction(transactionId: string, accountId: string, updateData: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.http.put<ApiResponse<Transaction>>(
      `${this.baseUrl}/account/${accountId}/transaction/${transactionId}`,
      updateData
    );
  }

  /**
   * Notifica outros componentes que as transações foram atualizadas
   * Método movido do TransactionService
   */
  updateTransactions(): void {
    this.transactionsUpdated.next();
  }
}

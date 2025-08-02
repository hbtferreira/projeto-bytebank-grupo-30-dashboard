import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService extends BaseService<Card> {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  public cards$ = this.cardsSubject.asObservable();

  constructor(http: HttpClient) {
    super(http, 'cards');
    this.loadInitialCards();
  }

  private loadInitialCards(): void {
    const initialCards: Card[] = [
      {
        id: '1',
        cardNumber: '**** **** **** 1234',
        cardHolder: 'João Silva',
        expiryDate: '12/27',
        brand: 'visa',
        funcao: 'crédito',
        isBlocked: false
      },
      {
        id: '2',
        cardNumber: '**** **** **** 5678',
        cardHolder: 'João Silva',
        expiryDate: '08/26',
        brand: 'mastercard',
        funcao: 'débito',
        isBlocked: false
      }
    ];
    this.cardsSubject.next(initialCards);
  }

  getCards(): Observable<Card[]> {
    return this.cards$;
  }

  configureCard(cardId: string): Observable<boolean> {
    // Simulate API call
    console.log(`Configurando cartão ${cardId}`);
    return of(true);
  }

  toggleCardBlock(cardId: string): Observable<boolean> {
    const currentCards = this.cardsSubject.value;
    const cardIndex = currentCards.findIndex(card => card.id === cardId);

    if (cardIndex !== -1) {
      const updatedCards = [...currentCards];
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        isBlocked: !updatedCards[cardIndex].isBlocked
      };
      this.cardsSubject.next(updatedCards);

      const action = updatedCards[cardIndex].isBlocked ? 'bloqueado' : 'desbloqueado';
      console.log(`Cartão ${cardId} ${action} com sucesso`);
      return of(true);
    }

    return of(false);
  }
}

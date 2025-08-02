import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../../../models/card.model';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="card-item" [class.card-item--blocked]="card.isBlocked">
      <div class="card-item__visual">
        <div class="credit-card" [class.credit-card--debit]="card.funcao === 'débito'">
          <div class="credit-card__header">
            <span class="credit-card__brand">Byte</span>
          </div>
          <div class="credit-card__function">Platinum</div>
          <div class="credit-card__number">{{ card.cardNumber }}</div>
          <div class="credit-card__info">
            <div class="credit-card__holder">{{ card.cardHolder }}</div>
            <div class="credit-card__expiry">{{ card.expiryDate }}</div>
          </div>
          <div *ngIf="card.isBlocked" class="credit-card__blocked-overlay">
            <mat-icon>block</mat-icon>
            <span>CARTÃO BLOQUEADO</span>
          </div>
        </div>
      </div>

      <div class="card-item__actions">
        <button
          mat-flat-button
          class="card-item__button card-item__button--configure"
          (click)="onConfigure()"
          [disabled]="card.isBlocked"
        >
          Configurar
        </button>

        <button
          mat-stroked-button
          class="card-item__button card-item__button--block"
          (click)="onBlock()"
        >
          {{ card.isBlocked ? 'Desbloquear' : 'Bloquear' }}
        </button>
        
        <div class="card-item__function">{{ card.funcao | titlecase }}</div>
      </div>
    </div>
  `,
  styleUrls: ['../my-cards.component.scss']
})
export class CreditCardComponent {
  @Input() card!: Card;
  @Output() configure = new EventEmitter<Card>();
  @Output() block = new EventEmitter<Card>();

  onConfigure(): void {
    this.configure.emit(this.card);
  }

  onBlock(): void {
    this.block.emit(this.card);
  }

  getCardBrandIcon(brand: string): string {
    switch (brand) {
      case 'visa':
        return 'credit_card';
      case 'mastercard':
        return 'credit_card';
      case 'elo':
        return 'credit_card';
      default:
        return 'credit_card';
    }
  }
}

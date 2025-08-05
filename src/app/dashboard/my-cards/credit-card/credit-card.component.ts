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
    <div class="card-item" [class.card-item--blocked]="card.is_blocked">
      <div class="card-item__visual">
        <div class="credit-card" [class.credit-card--debit]="card.functions === 'Debit'">
          <div class="credit-card__header">
            <span class="credit-card__brand">Byte</span>
          </div>
          <div class="credit-card__function">{{ card.type }}</div>
          <div class="credit-card__number">**** **** **** {{ card.number.toString().slice(-4) }}</div>
          <div class="credit-card__info">
            <div class="credit-card__holder">{{ card.name }}</div>
            <div class="credit-card__expiry">{{ formatDate(card.dueDate) }}</div>
          </div>
          <div *ngIf="card.is_blocked" class="credit-card__blocked-overlay">
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
          [disabled]="card.is_blocked"
        >
          Configurar
        </button>

        <button
          mat-stroked-button
          class="card-item__button card-item__button--block"
          (click)="onBlock()"
        >
          {{ card.is_blocked ? 'Desbloquear' : 'Bloquear' }}
        </button>

        <div class="card-item__function">{{ card.functions | titlecase }}</div>
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

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { CreditCardComponent } from './credit-card/credit-card.component';

@Component({
  selector: 'app-my-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CreditCardComponent
  ],
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss'],
})
export class MyCardsComponent implements OnInit {
  cards: Card[] = [];

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.cards$.subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: (err) => console.error('Erro ao carregar cartões:', err)
    });
  }

  onConfigure(card: Card): void {
    this.cardService.configureCard(card.id).subscribe({
      next: () => console.log('Cartão configurado com sucesso'),
      error: (err) => console.error('Erro ao configurar cartão:', err)
    });
  }

  onBlock(card: Card): void {
    this.cardService.toggleCardBlock(card.id).subscribe({
      next: () => {
        const action = card.isBlocked ? 'desbloqueado' : 'bloqueado';
        console.log(`Cartão ${action} com sucesso`);
      },
      error: (err) => console.error('Erro ao bloquear/desbloquear cartão:', err)
    });
  }
}

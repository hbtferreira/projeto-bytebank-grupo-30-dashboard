import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Card } from '../../models/card.model';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { AccountService } from 'src/app/services/account.service';

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
  @Input() cards: Card[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  onConfigure(card: Card): void {
    // Implementar lógica de configuração
    console.log('Configurando cartão:', card.id);
  }

  onBlock(card: Card): void {
    // Implementar lógica de bloqueio/desbloqueio
    console.log(`${card.is_blocked ? 'Desbloqueando' : 'Bloqueando'} cartão:`, card.id);
  }
}

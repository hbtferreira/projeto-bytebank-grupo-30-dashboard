export interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  brand: 'visa' | 'mastercard' | 'elo';
  funcao: 'débito' | 'crédito';
  isBlocked: boolean;
}

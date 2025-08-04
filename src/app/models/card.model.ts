export interface Card {
  id: string;
  accountId: string;
  type: string;
  is_blocked: boolean;
  number: number;
  dueDate: string;
  functions: string;
  cvc: string;
  paymentDate: string | null;
  name: string;
}

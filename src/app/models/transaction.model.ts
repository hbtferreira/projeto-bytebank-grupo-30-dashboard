export interface Transaction {
  id: string;
  accountId: string;
  type: string;
  value: number;
  from: string;
  to: string;
  date: Date;
  anexo?: string;
}

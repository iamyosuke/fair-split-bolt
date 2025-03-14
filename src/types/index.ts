export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY';

export interface Member {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  currency: Currency;
  members: Member[];
  createdAt: Date;
}
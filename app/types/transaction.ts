import type { UserSimple } from './user';

export interface Transaction {
  id: number;
  itemDescription: string;
  itemCategory?: string;
  notes?: string;
  ticketCode: string;
  inTime: string;
  outTime?: string;
  teamCode?: string;
  teamName?: string;
  lockerCode?: string;
  user?: UserSimple;
}

export interface TransactionRequest {
  userId: number;
  teamId: number;
  ticketCode: string;
  itemDescription: string;
  itemCategory?: string;
  notes?: string;
  lockerCode?: string;
}

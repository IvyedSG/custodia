import { computed } from 'vue';
import { store } from '../lib/store';
import type { Transaction, TransactionRequest } from '../types';

export const useTransactionService = () => {
  const activeTransactions = computed(() => 
    store.transactions.filter(t => !t.outTime)
  );

  const availableTickets = computed(() => {
    const tickets = [];
    for (let i = 1; i <= 48; i++) {
        const code = `TS-${String(i).padStart(3, '0')}`;
        const isUsed = activeTransactions.value.some(t => t.ticketCode === code);
        if (!isUsed) tickets.push(code);
    }
    return tickets;
  });

  const historicTransactions = computed(() => 
    store.transactions.filter(t => !!t.outTime)
  );

  const startTransaction = async (request: TransactionRequest) => {
    const user = store.users.find(u => u.id === request.userId);
    const team = store.teams.find(t => t.id === request.teamId);

    const newTransaction: Transaction = {
      id: Math.floor(Math.random() * 10000),
      itemDescription: request.itemDescription,
      itemCategory: request.itemCategory,
      notes: request.notes,
      ticketCode: request.ticketCode,
      lockerCode: request.lockerCode,
      inTime: new Date().toISOString(),
      teamName: team?.name || 'DESCONOCIDO',
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        documentNumber: user.documentNumber,
        phoneNumber: user.phoneNumber,
      } : undefined,
    };

    store.transactions.push(newTransaction);
    return newTransaction;
  };

  const endTransaction = async (transactionId: number) => {
    const transaction = store.transactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    transaction.outTime = new Date().toISOString();
    return transaction;
  };

  const updateLockerCode = async (transactionId: number, lockerCode: string) => {
    const transaction = store.transactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    transaction.lockerCode = lockerCode;
    return transaction;
  };

  return {
    activeTransactions,
    availableTickets,
    historicTransactions,
    startTransaction,
    endTransaction,
    updateLockerCode,
  };
};

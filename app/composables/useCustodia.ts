import { ref, computed } from 'vue';
import { useTransactionService } from '@/services/useTransactionService';
import type { CustodiaItem, LocationWithItems } from '@/components/custodia/types';
import type { Transaction } from '@/types';

const totalLockers = 48;

export const useCustodia = () => {
  const { activeTransactions, endTransaction, updateLockerCode } = useTransactionService();

  const mapTransactionToCustodiaItem = (item: Transaction): CustodiaItem => {
    const inTimeDate = item.inTime ? new Date(item.inTime) : undefined;
    return {
      id: item.id,
      nombres: `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim(),
      numeracion: item.ticketCode || 'N/A',
      ubicacion: item.lockerCode || '0',
      equipo: item.teamName || 'N/A',
      telefono: item.user?.phoneNumber || 'N/A',
      entregado: !!item.outTime,
      fechaIngreso: inTimeDate ? inTimeDate.toLocaleDateString('es-ES') : undefined,
      horaIngreso: inTimeDate ? inTimeDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : undefined,
      itemDescription: item.itemDescription || '',
      itemCategory: item.itemCategory || '',
      notes: item.notes || '',
      userId: item.user?.id,
    };
  };

  const allLocations = computed<LocationWithItems[]>(() => {
    const locations: LocationWithItems[] = [];
    const transactions = activeTransactions.value;

    for (let i = 1; i <= totalLockers; i++) {
      const lockerCodeStr = String(i);
      const itemsInLocker = transactions.filter(t => t.lockerCode?.trim() === lockerCodeStr);
      const transformedItems = itemsInLocker.map(mapTransactionToCustodiaItem);

      locations.push({
        location: i,
        items: transformedItems,
        isEmpty: transformedItems.length === 0,
      });
    }
    return locations;
  });

  const overflowItems = computed<CustodiaItem[]>(() => {
    const extras = activeTransactions.value.filter(t => {
      const locker = t.lockerCode?.trim();
      if (!locker) return true;
      const num = Number(locker);
      return isNaN(num) || num < 1 || num > totalLockers;
    });

    return extras.map(mapTransactionToCustodiaItem);
  });

  return {
    allLocations,
    isLoading: ref(false),
    isError: ref(false),
    refetchActiveTransactions: async () => {},
    overflowItems,
  };
};
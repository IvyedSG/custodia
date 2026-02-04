import { reactive, watch } from 'vue';
import type { Transaction, User, Team } from '../types';

export interface AppStore {
  transactions: Transaction[];
  users: User[];
  teams: Team[];
}

const STORAGE_KEY = 'logistics_app_store';

const initialUsers: User[] = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'Logística',
    phoneNumber: '999999999',
    documentNumber: 'ADMIN-001',
    email: 'admin@logistics.com',
    isActive: true,
    role: 'ADMIN',
  },
];

const initialTeams: Team[] = [
  { id: 1, name: 'ADMINISTRACIÓN' },
  { id: 2, name: 'LOGÍSTICA' },
  { id: 3, name: 'OPERACIONES' },
  { id: 4, name: 'SEGURIDAD' },
  { id: 5, name: 'VOLUNTARIADO' },
];

const initialTransactions: Transaction[] = [];

const savedData = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const parsedData = savedData ? JSON.parse(savedData) : null;

export const store = reactive<AppStore>({
  transactions: parsedData?.transactions || initialTransactions,
  users: parsedData?.users || initialUsers,
  teams: parsedData?.teams || initialTeams,
});

if (typeof window !== 'undefined') {
  watch(store, (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, { deep: true });
}

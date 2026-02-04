import { computed } from 'vue';
import { store } from '../lib/store';
import type { User, Team } from '../types';

export const useUserService = () => {
  const users = computed(() => store.users);
  const teams = computed(() => store.teams);

  const searchUser = async (query: string) => {
    const user = store.users.find(u => 
      u.documentNumber === query || u.phoneNumber === query
    );
    return user;
  };

  const createUser = async (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      documentNumber: userData.documentNumber || '',
      phoneNumber: userData.phoneNumber || '',
      email: userData.email,
      isActive: true,
      createdAt: new Date().toISOString(),
      role: 'USER',
      ...userData,
    };
    store.users.push(newUser);
    return newUser;
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    const index = store.users.findIndex(u => u.id === id);
    if (index !== -1) {
      store.users[index] = { ...store.users[index], ...userData, id } as User;
    }
    return store.users[index];
  };

  const getTeamName = (teamId?: number) => {
    const team = store.teams.find(t => t.id === teamId);
    return team ? team.name : 'N/A';
  };

  return {
    users,
    teams,
    searchUser,
    createUser,
    updateUser,
    getTeamName,
  };
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  documentNumber: string;
  email?: string;
  isActive: boolean;
  createdAt?: string;
  role?: 'ADMIN' | 'OPERATOR' | 'USER';
  teamId?: number;
}

export interface UserSimple {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  documentNumber: string;
}

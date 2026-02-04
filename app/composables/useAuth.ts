import { store } from '../lib/store';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

const AUTH_KEY = 'logistics_auth_user';

export const useAuth = () => {
  const router = useRouter();

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const user = store.users.find(u => 
      (u.email === credentials.username || u.phoneNumber === credentials.username)
    );

    if (user && credentials.password === 'admin123') {
      const userInfo: UserInfo = {
        username: user.email || user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'USER',
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(userInfo));
      }
      return { success: true, message: 'Sesión iniciada' };
    }

    throw new Error('Credenciales inválidas. Use admin@logistics.com / admin123');
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
    await router.push('/login');
  };

  const getCurrentUser = (): UserInfo | null => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  };

  const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
  };

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
  };
};

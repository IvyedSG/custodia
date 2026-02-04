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
  const authCookie = useCookie<UserInfo | null>(AUTH_KEY, {
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/',
    sameSite: 'lax',
  });

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
      
      authCookie.value = userInfo;
      return { success: true, message: 'Sesión iniciada' };
    }

    throw new Error('Credenciales inválidas. Use admin@logistics.com / admin123');
  };

  const logout = async () => {
    authCookie.value = null;
    await router.push('/login');
  };

  const getCurrentUser = (): UserInfo | null => {
    return authCookie.value || null;
  };

  const isAuthenticated = (): boolean => {
    return !!authCookie.value;
  };

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
  };
};

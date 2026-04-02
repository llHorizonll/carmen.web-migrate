import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export interface LoginCredentials {
  Tenant: string;
  UserName: string;
  Password: string;
  Language?: string;
}

export interface User {
  UserId: number;
  UserName: string;
  FullName: string;
  Email: string;
  Permissions: string[];
  DefaultLanguage: string;
}

export interface LoginResponse {
  AccessToken: string;
  RefreshToken: string;
  ExpiresIn: number;
  User: User;
}

export interface Tenant {
  TenantId: number;
  Tenant: string;
  Description: string;
  IsDefault: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tenant: string | null;
  language: string;
  rememberMe: boolean;
  
  // Actions
  login: (response: LoginResponse, tenant: string, rememberMe: boolean) => void;
  logout: () => void;
  setTenant: (tenant: string) => void;
  setLanguage: (language: string) => void;
  updateUser: (user: Partial<User>) => void;
}

// ============================================================================
// Auth Store with Zustand
// ============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      tenant: null,
      language: 'en-US',
      rememberMe: false,

      login: (response, tenant, rememberMe) => {
        set({
          isAuthenticated: true,
          user: response.User,
          accessToken: response.AccessToken,
          refreshToken: response.RefreshToken,
          tenant,
          rememberMe,
        });

        // Store in localStorage for axios interceptors
        localStorage.setItem('AccessToken', response.AccessToken);
        localStorage.setItem('RefreshToken', response.RefreshToken);
        localStorage.setItem('Tenant', tenant);
        localStorage.setItem('UserName', response.User.UserName);
        
        if (rememberMe) {
          localStorage.setItem('RememberMe', 'true');
        } else {
          localStorage.removeItem('RememberMe');
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          tenant: null,
          rememberMe: false,
        });

        // Clear localStorage
        localStorage.removeItem('AccessToken');
        localStorage.removeItem('RefreshToken');
        localStorage.removeItem('Tenant');
        localStorage.removeItem('RememberMe');
        // Keep UserName if remember me was checked
        const rememberMe = localStorage.getItem('RememberMe');
        if (!rememberMe) {
          localStorage.removeItem('UserName');
        }
      },

      setTenant: (tenant) => {
        set({ tenant });
        localStorage.setItem('Tenant', tenant);
      },

      setLanguage: (language) => {
        set({ language });
        localStorage.setItem('Language', language);
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        language: state.language,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

// ============================================================================
// Login API Service
// ============================================================================

const LOGIN_API_URL = 'https://dev.carmen4.com/Carmen.api/api/Login/Login';

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await axios.post(LOGIN_API_URL, {
      Tenant: credentials.Tenant,
      UserName: credentials.UserName,
      Password: credentials.Password,
      Language: credentials.Language || 'en-US',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    const data = response.data;

    // Handle API error responses
    if (data.Code !== 0 && data.Code !== 200) {
      throw new Error(data.UserMessage || data.Message || 'Login failed');
    }

    // Transform API response to our LoginResponse format
    return {
      AccessToken: data.AccessToken || data.Data?.AccessToken,
      RefreshToken: data.RefreshToken || data.Data?.RefreshToken,
      ExpiresIn: data.ExpiresIn || data.Data?.ExpiresIn || 3600,
      User: {
        UserId: data.User?.UserId || data.Data?.User?.UserId || 0,
        UserName: data.User?.UserName || data.Data?.User?.UserName || credentials.UserName,
        FullName: data.User?.FullName || data.Data?.User?.FullName || credentials.UserName,
        Email: data.User?.Email || data.Data?.User?.Email || '',
        Permissions: data.User?.Permissions || data.Data?.User?.Permissions || [],
        DefaultLanguage: data.User?.DefaultLanguage || data.Data?.User?.DefaultLanguage || credentials.Language || 'en-US',
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.UserMessage) {
        throw new Error(error.response.data.UserMessage);
      }
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      if (error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
    }
    throw error;
  }
}

export async function getTenantsByUsername(username: string): Promise<Tenant[]> {
  try {
    // Use the base URL from the login API
    const baseUrl = 'https://dev.carmen4.com/Carmen.api';
    const response = await axios.post(`${baseUrl}/api/Login/GetTenantByUserName`, {
      Username: username,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    const data = response.data;

    if (data.Code !== 0 && data.Code !== 200) {
      throw new Error(data.UserMessage || data.Message || 'Failed to fetch tenants');
    }

    return data.Data || data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.UserMessage) {
        throw new Error(error.response.data.UserMessage);
      }
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
    }
    throw error;
  }
}

export async function refreshTokenApi(refreshToken: string): Promise<LoginResponse> {
  try {
    const baseUrl = 'https://dev.carmen4.com/Carmen.api';
    const response = await axios.post(`${baseUrl}/api/Login/RefreshToken`, {
      RefreshToken: refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    const data = response.data;

    if (data.Code !== 0 && data.Code !== 200) {
      throw new Error(data.UserMessage || data.Message || 'Token refresh failed');
    }

    return {
      AccessToken: data.AccessToken || data.Data?.AccessToken,
      RefreshToken: data.RefreshToken || data.Data?.RefreshToken,
      ExpiresIn: data.ExpiresIn || data.Data?.ExpiresIn || 3600,
      User: {
        UserId: data.User?.UserId || data.Data?.User?.UserId,
        UserName: data.User?.UserName || data.Data?.User?.UserName,
        FullName: data.User?.FullName || data.Data?.User?.FullName,
        Email: data.User?.Email || data.Data?.User?.Email,
        Permissions: data.User?.Permissions || data.Data?.User?.Permissions || [],
        DefaultLanguage: data.User?.DefaultLanguage || data.Data?.User?.DefaultLanguage || 'en-US',
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.UserMessage) {
        throw new Error(error.response.data.UserMessage);
      }
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
    }
    throw error;
  }
}

// ============================================================================
// Auth Helpers
// ============================================================================

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('AccessToken');
  return !!token;
}

export function getStoredUsername(): string {
  return localStorage.getItem('UserName') || '';
}

export function getStoredTenant(): string {
  return localStorage.getItem('Tenant') || 'dev';
}

export function getStoredLanguage(): string {
  return localStorage.getItem('Language') || 'en-US';
}

export function clearStoredAuth(): void {
  localStorage.removeItem('AccessToken');
  localStorage.removeItem('RefreshToken');
  localStorage.removeItem('Tenant');
  localStorage.removeItem('Language');
  const rememberMe = localStorage.getItem('RememberMe');
  if (!rememberMe) {
    localStorage.removeItem('UserName');
  }
}

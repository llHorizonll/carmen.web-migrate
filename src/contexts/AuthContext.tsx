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

// Permission object returned by Carmen API
export interface ApiPermission {
  Seq: number;
  Name: string;
  View: boolean;
  Add: boolean;
  Edit: boolean;
  Delete: boolean;
  Print: boolean;
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
        
        // Store Permissions in localStorage for authorization checks
        if (response.User.Permissions && response.User.Permissions.length > 0) {
          localStorage.setItem('Permissions', JSON.stringify(response.User.Permissions));
        }
        
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
        localStorage.removeItem('Permissions');
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

const LOGIN_API_URL = 'https://dev.carmen4.com/carmen.api/api/login';
const ADMIN_TOKEN = 'f9ebce3d77f2f445dee52ba252cc53ee';

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // New Login API: POST /api/login?adminToken={adminToken}
    const response = await axios.post(`${LOGIN_API_URL}?adminToken=${ADMIN_TOKEN}`, {
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

    // Handle API error responses (if the API returns error codes)
    if (data.Code !== undefined && data.Code !== 0 && data.Code !== 200) {
      throw new Error(data.UserMessage || data.Message || 'Login failed');
    }

    // Transform permissions from API format (array of objects) to string array
    // API returns: [{ Seq: 1, Name: "GL.Jv", View: true, ... }, ...]
    // We need: ["GL.Jv", "Sys.Administration", ...]
    const rawPermissions = data.Permissions || data.User?.Permissions || data.Data?.Permissions || [];
    const permissions: string[] = Array.isArray(rawPermissions)
      ? rawPermissions.map((p: ApiPermission | string) => (typeof p === 'string' ? p : p.Name))
      : [];

    // Transform API response to our LoginResponse format
    // The new API returns: { AccessToken, Permissions, ... }
    return {
      AccessToken: data.AccessToken || data.Data?.AccessToken,
      RefreshToken: data.RefreshToken || data.Data?.RefreshToken,
      ExpiresIn: data.ExpiresIn || data.Data?.ExpiresIn || 3600,
      User: {
        UserId: data.UserId || data.User?.UserId || data.Data?.UserId || 0,
        UserName: data.UserName || data.User?.UserName || credentials.UserName,
        FullName: data.FullName || data.User?.FullName || credentials.UserName,
        Email: data.Email || data.User?.Email || '',
        Permissions: permissions,
        DefaultLanguage: data.Language || data.User?.Language || credentials.Language || 'en-US',
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
    // New Tenant List API: GET /api/userTenant/tenantListIn/{adminToken}/{user}
    const baseUrl = 'https://dev.carmen4.com/carmen.api';
    const adminToken = 'f9ebce3d77f2f445dee52ba252cc53ee';
    const response = await axios.get(`${baseUrl}/api/userTenant/tenantListIn/${adminToken}/${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    // The API returns an array directly
    const data = response.data;
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    
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

    // Transform permissions from API format (array of objects) to string array
    const rawPermissions = data.User?.Permissions || data.Data?.User?.Permissions || [];
    const permissions: string[] = Array.isArray(rawPermissions)
      ? rawPermissions.map((p: ApiPermission | string) => (typeof p === 'string' ? p : p.Name))
      : [];

    return {
      AccessToken: data.AccessToken || data.Data?.AccessToken,
      RefreshToken: data.RefreshToken || data.Data?.RefreshToken,
      ExpiresIn: data.ExpiresIn || data.Data?.ExpiresIn || 3600,
      User: {
        UserId: data.User?.UserId || data.Data?.User?.UserId,
        UserName: data.User?.UserName || data.Data?.User?.UserName,
        FullName: data.User?.FullName || data.Data?.User?.FullName,
        Email: data.User?.Email || data.Data?.User?.Email,
        Permissions: permissions,
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
  localStorage.removeItem('Permissions');
  const rememberMe = localStorage.getItem('RememberMe');
  if (!rememberMe) {
    localStorage.removeItem('UserName');
  }
}

// ============================================================================
// Permissions Helper
// ============================================================================

export function getStoredPermissions(): string[] {
  const permissionsStr = localStorage.getItem('Permissions');
  if (!permissionsStr) return [];
  try {
    return JSON.parse(permissionsStr) as string[];
  } catch {
    return [];
  }
}

export function hasPermission(permission: string): boolean {
  const permissions = getStoredPermissions();
  return permissions.includes(permission);
}

export function hasAnyPermission(requiredPermissions: string[]): boolean {
  const permissions = getStoredPermissions();
  return requiredPermissions.some(p => permissions.includes(p));
}

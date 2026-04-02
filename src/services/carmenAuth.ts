/**
 * Carmen API Authentication Service
 * Handles login/logout and token management for Carmen API
 * Base URL: https://dev.carmen4.com/Carmen.api
 */

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// ============================================================================
// Configuration
// ============================================================================

const CARMEN_API_BASE_URL = 'https://dev.carmen4.com/Carmen.api';
const CARMEN_ADMIN_TOKEN = 'f9ebce3d77f2f445dee52ba252cc53ee';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'carmen_access_token',
  REFRESH_TOKEN: 'carmen_refresh_token',
  TOKEN_EXPIRY: 'carmen_token_expiry',
  USER: 'carmen_user',
  ADMIN_TOKEN: 'carmen_admin_token',
} as const;

// ============================================================================
// Types
// ============================================================================

export interface CarmenLoginRequest {
  Email: string;
  Language: string;
  Tenant: string;
  Password: string;
  UserName: string;
}

export interface CarmenLoginResponse {
  AccessToken: string;
  RefreshToken?: string;
  ExpiresIn?: number;
  TokenType?: string;
  User?: {
    UserId: number;
    UserName: string;
    Email: string;
    FullName?: string;
  };
}

export interface CarmenUser {
  UserId: number;
  UserName: string;
  Email: string;
  FullName?: string;
  exp?: number;
  iat?: number;
}

export interface JwtPayload {
  UserId: number;
  UserName: string;
  Email: string;
  FullName?: string;
  exp: number;
  iat: number;
  [key: string]: unknown;
}

// ============================================================================
// Axios Instance for Carmen API
// ============================================================================

export const carmenAxios = axios.create({
  baseURL: CARMEN_API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ============================================================================
// Request Interceptor - Add Auth Headers
// ============================================================================

carmenAxios.interceptors.request.use(
  async (config) => {
    // Add Admin-Token header for all requests
    config.headers['Admin-Token'] = CARMEN_ADMIN_TOKEN;
    
    // Add Authorization header if we have an access token
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// Response Interceptor - Handle Token Refresh
// ============================================================================

carmenAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return carmenAxios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and reject
        clearAuth();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// Authentication Functions
// ============================================================================

/**
 * Login to Carmen API
 * POST /api/Login/Login
 * 
 * Note: The actual API endpoint behavior may vary based on server configuration.
 * The endpoint may require specific headers or different routing.
 */
export async function carmenLogin(
  credentials: Partial<CarmenLoginRequest> = {}
): Promise<CarmenLoginResponse> {
  const defaultCredentials: CarmenLoginRequest = {
    Email: 'admin@carmen.com',
    Language: 'en-US',
    Tenant: 'dev',
    Password: 'alpha',
    UserName: 'admin',
  };

  const loginData = { ...defaultCredentials, ...credentials };
  
  console.log('[CarmenAuth] Attempting login with:', {
    UserName: loginData.UserName,
    Tenant: loginData.Tenant,
    Email: loginData.Email,
  });

  try {
    const response = await carmenAxios.post<CarmenLoginResponse>(
      '/api/Login/Login',
      loginData
    );

    const { AccessToken, RefreshToken, ExpiresIn, User } = response.data;

    // Store tokens
    setAccessToken(AccessToken);
    if (RefreshToken) {
      setRefreshToken(RefreshToken);
    }
    if (User) {
      setStoredUser(User);
    }

    // Calculate and store expiry
    if (ExpiresIn) {
      const expiryTime = Date.now() + ExpiresIn * 1000;
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }

    console.log('[CarmenAuth] Login successful');
    return response.data;
  } catch (error: any) {
    console.error('[CarmenAuth] Login failed:', error.message);
    if (error.response) {
      console.error('[CarmenAuth] Response status:', error.response.status);
      console.error('[CarmenAuth] Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Logout - clear all stored auth data
 */
export function carmenLogout(): void {
  clearAuth();
  console.log('[CarmenAuth] Logged out');
}

/**
 * Refresh the access token
 * Note: This is a placeholder - implement based on Carmen API's refresh endpoint
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    // TODO: Implement actual refresh token endpoint when available
    // const response = await carmenAxios.post('/api/Login/RefreshToken', {
    //   RefreshToken: refreshToken,
    // });
    // setAccessToken(response.data.AccessToken);
    // return response.data.AccessToken;
    
    // For now, just return null and let the caller handle re-login
    return null;
  } catch (error) {
    clearAuth();
    return null;
  }
}

// ============================================================================
// Token Management
// ============================================================================

export function setAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function setStoredUser(user: CarmenUser): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredUser(): CarmenUser | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as CarmenUser;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ============================================================================
// JWT Utilities
// ============================================================================

/**
 * Decode JWT token to get payload
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('[CarmenAuth] Failed to decode token:', error);
    return null;
  }
}

/**
 * Get decoded user from current token
 */
export function getCurrentUser(): CarmenUser | null {
  const token = getAccessToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    UserId: decoded.UserId,
    UserName: decoded.UserName,
    Email: decoded.Email,
    FullName: decoded.FullName,
    exp: decoded.exp,
    iat: decoded.iat,
  };
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  const expiryStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiryStr) return true;
  
  const expiry = parseInt(expiryStr, 10);
  // Check if expired (with 60 second buffer)
  return Date.now() >= expiry - 60000;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  
  // Check expiry from localStorage first
  if (isTokenExpired()) return false;
  
  // Also verify JWT hasn't expired
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Check JWT exp claim (with 60 second buffer)
  return decoded.exp * 1000 > Date.now() + 60000;
}

// ============================================================================
// Export Config
// ============================================================================

export const carmenConfig = {
  baseURL: CARMEN_API_BASE_URL,
  adminToken: CARMEN_ADMIN_TOKEN,
  storageKeys: STORAGE_KEYS,
} as const;

export default {
  login: carmenLogin,
  logout: carmenLogout,
  isAuthenticated,
  getAccessToken,
  getCurrentUser,
  decodeToken,
  axios: carmenAxios,
  config: carmenConfig,
};

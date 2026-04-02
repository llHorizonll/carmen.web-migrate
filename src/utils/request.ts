/**
 * Axios Configuration
 * Based on original src/utils/request.js
 * Preserves exact same API behavior
 */

import type { AxiosError} from 'axios';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { notifications } from '@mantine/notifications';

// ============================================================================
// Window Config Type
// ============================================================================

declare global {
  interface Window {
    config: {
      apiUrl: string;
      adminToken: string;
      arrCompany: {
        name: string;
        apiUrl: string;
        adminToken: string;
      }[];
    };
  }
}

// ============================================================================
// Configuration
// ============================================================================

const CARMEN_API_BASE_URL = 'https://dev.carmen4.com/Carmen.api';

// ============================================================================
// Axios Instance
// ============================================================================

let showSnack = false;

export const axiosAuth = axios.create({
  baseURL: window.config?.apiUrl || CARMEN_API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ============================================================================
// Request Interceptor
// ============================================================================

axiosAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get base URL dynamically
    const baseUrl = await getBaseUrl();
    config.baseURL = baseUrl;

    // Get token from localStorage
    const token = localStorage.getItem('AccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle desktop app tokens
    const url = new URL(window.location.href);
    const tkFromDesktop = url.searchParams.get('tk');
    if (tkFromDesktop) {
      config.headers.Authorization = `Bearer ${tkFromDesktop}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// Response Interceptor
// ============================================================================

axiosAuth.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle Network Error
    if (error.message === 'Network Error') {
      const url = new URL(window.location.origin);
      const callFromDesktopApp =
        url.searchParams.get('ShowOnlyDashboard') === 'true';

      if (callFromDesktopApp) {
        return Promise.reject(error);
      }

      if (!showSnack) {
        window.location.replace(`${url.origin}#/login`);
        showSnack = true;
      }
      return Promise.reject(error);
    }

    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 303:
          if (data?.Code === -100) {
            notifications.show({
              message: data.UserMessage || data.Message || 'Warning',
              color: 'yellow',
            });
          }
          break;

        case 400:
          notifications.show({
            message: data?.UserMessage || data?.Message || 'Bad Request',
            color: 'red',
          });
          break;

        case 401:
          if (!showSnack) {
            localStorage.removeItem('AccessToken');
            notifications.show({
              message: 'Session expired. Please login again.',
              color: 'red',
            });
            window.location.replace(`${window.location.origin}#/login`);
            showSnack = true;
          }
          break;

        case 403:
          notifications.show({
            message: 'Access denied',
            color: 'red',
          });
          break;

        case 404:
          notifications.show({
            message: data?.UserMessage || data?.Message || 'Not found',
            color: 'red',
          });
          break;

        case 500:
          notifications.show({
            message: data?.UserMessage || data?.Message || 'Server error',
            color: 'red',
          });
          break;

        default:
          notifications.show({
            message: data?.UserMessage || data?.Message || 'An error occurred',
            color: 'red',
          });
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Helper Functions
// ============================================================================

interface ApiErrorResponse {
  Code?: number;
  Message?: string;
  UserMessage?: string;
}

export async function getBaseUrl(): Promise<string> {
  const url = new URL(window.location.href);
  const tkFromDesktop = url.searchParams.get('tk');
  const desktopUrlApi = url.searchParams.get('urlApi');

  if (tkFromDesktop && desktopUrlApi) {
    return desktopUrlApi;
  }

  const adminToken = localStorage.getItem('adminToken');
  if (adminToken && window.config?.arrCompany) {
    const company = window.config.arrCompany.find(
      (c) => c.adminToken === adminToken
    );
    if (company) {
      return company.apiUrl;
    }
  }

  return window.config?.apiUrl || CARMEN_API_BASE_URL;
}

export function resetSnack(): void {
  showSnack = false;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('AccessToken', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('AccessToken');
}

export default axiosAuth;

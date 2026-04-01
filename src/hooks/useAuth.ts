/**
 * Authentication Hooks
 * TanStack Query hooks for Authentication operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  LoginRequest,
  LoginResponse,
} from '../types';
import {
  login,
  logout,
  getCurrentUser,
  changePassword,
} from '../services/user';
import { setAuthToken, clearAuthToken } from '../utils/request';

const QUERY_KEYS = {
  currentUser: 'currentUser',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useCurrentUser(enabled = true) {
  return useQuery<LoginResponse['User'], Error>({
    queryKey: [QUERY_KEYS.currentUser],
    queryFn: getCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await login(credentials);
      if (response.AccessToken) {
        setAuthToken(response.AccessToken);
      }
      return response;
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData([QUERY_KEYS.currentUser], data.User);
      notifications.show({
        title: 'Welcome',
        message: `Logged in as ${data.User.FullName}`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Login Failed',
        message: error.message || 'Invalid credentials',
        color: 'red',
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      try {
        await logout();
      } finally {
        clearAuthToken();
      }
    },
    onSuccess: async () => {
      queryClient.clear();
      notifications.show({
        title: 'Goodbye',
        message: 'You have been logged out successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to logout',
        color: 'red',
      });
    },
  });
}

export function useChangePassword() {
  return useMutation<
    void,
    Error,
    { oldPassword: string; newPassword: string; confirmPassword: string }
  >({
    mutationFn: ({ oldPassword, newPassword, confirmPassword }) =>
      changePassword({
        OldPassword: oldPassword,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      }),
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Password changed successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to change password',
        color: 'red',
      });
    },
  });
}

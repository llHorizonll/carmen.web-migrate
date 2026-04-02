/**
 * Carmen Auth React Hooks
 * React hooks for authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  carmenLogin,
  carmenLogout,
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
  type CarmenLoginRequest,
  type CarmenLoginResponse,
  type CarmenUser,
} from '../services/carmenAuth';

// ============================================================================
// Query Keys
// ============================================================================

export const carmenAuthKeys = {
  all: ['carmenAuth'] as const,
  user: () => [...carmenAuthKeys.all, 'user'] as const,
  status: () => [...carmenAuthKeys.all, 'status'] as const,
};

// ============================================================================
// useCarmenAuth Hook
// ============================================================================

export interface UseCarmenAuthReturn {
  // State
  isAuthenticated: boolean;
  user: CarmenUser | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  login: (credentials?: Partial<CarmenLoginRequest>) => void;
  logout: () => void;
  
  // Mutation states
  isLoginPending: boolean;
  isLogoutPending: boolean;
}

/**
 * Main authentication hook for Carmen API
 * Manages auth state and provides login/logout functions
 */
export function useCarmenAuth(): UseCarmenAuthReturn {
  const queryClient = useQueryClient();
  
  // Local state for immediate feedback
  const [authState, setAuthState] = useState(() => ({
    isAuthenticated: checkIsAuthenticated(),
    user: getCurrentUser(),
  }));

  // Query for auth status
  const { isLoading, error } = useQuery({
    queryKey: carmenAuthKeys.status(),
    queryFn: () => {
      const authenticated = checkIsAuthenticated();
      const user = getCurrentUser();
      setAuthState({ isAuthenticated: authenticated, user });
      return { isAuthenticated: authenticated, user };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation<CarmenLoginResponse, Error, Partial<CarmenLoginRequest> | undefined>({
    mutationFn: (credentials) => carmenLogin(credentials),
    onSuccess: () => {
      // Invalidate and refetch auth status
      queryClient.invalidateQueries({ queryKey: carmenAuthKeys.all });
      setAuthState({
        isAuthenticated: checkIsAuthenticated(),
        user: getCurrentUser(),
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error>({
    mutationFn: () => {
      carmenLogout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
      setAuthState({ isAuthenticated: false, user: null });
    },
  });

  // Login wrapper
  const login = useCallback(
    (credentials?: Partial<CarmenLoginRequest>) => {
      loginMutation.mutate(credentials);
    },
    [loginMutation]
  );

  // Logout wrapper
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading,
    error,
    login,
    logout,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  };
}

// ============================================================================
// useCarmenUser Hook
// ============================================================================

export interface UseCarmenUserReturn {
  user: CarmenUser | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to get current user information
 */
export function useCarmenUser(): UseCarmenUserReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: carmenAuthKeys.user(),
    queryFn: () => {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
      return user;
    },
    enabled: checkIsAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: data ?? null,
    isLoading,
    error,
    refetch,
  };
}

// ============================================================================
// useCarmenToken Hook
// ============================================================================

export interface UseCarmenTokenReturn {
  token: string | null;
  isExpired: boolean;
  getAuthHeader: () => { Authorization: string } | null;
}

import { getAccessToken, isTokenExpired } from '../services/carmenAuth';

/**
 * Hook to access the current access token
 */
export function useCarmenToken(): UseCarmenTokenReturn {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [expired, setExpired] = useState<boolean>(() => isTokenExpired());

  useEffect(() => {
    // Update token state periodically
    const interval = setInterval(() => {
      setToken(getAccessToken());
      setExpired(isTokenExpired());
    }, 1000 * 30); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getAuthHeader = useCallback(() => {
    if (!token || expired) return null;
    return { Authorization: `Bearer ${token}` };
  }, [token, expired]);

  return {
    token,
    isExpired: expired,
    getAuthHeader,
  };
}

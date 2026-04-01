/**
 * AR Profile Hooks
 * TanStack Query hooks for Accounts Receivable Profile operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ArProfile,
  ArFolio,
  ArProfileFilterParams,
  ArFolioFilterParams,
  PagingResult,
} from '../types';
import {
  getArProfileList,
  getArProfileDetail,
  createArProfile,
  updateArProfile,
  deleteArProfile,
  getArFolioList,
  getArFolioBalance,
  getArTypeList,
} from '../services/accountReceivable';

const QUERY_KEYS = {
  list: 'arProfileList',
  detail: 'arProfileDetail',
  folio: 'arFolio',
  folioBalance: 'arFolioBalance',
  arTypeList: 'arTypeList',
} as const;

// ============================================================================
// AR Profile Query Hooks
// ============================================================================

export function useArProfileList(params: ArProfileFilterParams) {
  return useQuery<PagingResult<ArProfile>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getArProfileList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useArProfileDetail(ProfileId: number) {
  return useQuery<ArProfile, Error>({
    queryKey: [QUERY_KEYS.detail, ProfileId],
    queryFn: () => getArProfileDetail(ProfileId),
    enabled: ProfileId > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// AR Profile Mutation Hooks
// ============================================================================

export function useCreateArProfile() {
  const queryClient = useQueryClient();

  return useMutation<ArProfile, Error, Omit<ArProfile, 'ProfileId'>>({
    mutationFn: createArProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AR Profile created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create AR profile',
        color: 'red',
      });
    },
  });
}

export function useUpdateArProfile() {
  const queryClient = useQueryClient();

  return useMutation<ArProfile, Error, ArProfile>({
    mutationFn: updateArProfile,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ProfileId],
      });
      notifications.show({
        title: 'Success',
        message: 'AR Profile updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update AR profile',
        color: 'red',
      });
    },
  });
}

export function useDeleteArProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteArProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AR Profile deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete AR profile',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// AR Folio Query Hooks
// ============================================================================

export function useArFolioList(params: ArFolioFilterParams) {
  return useQuery<ArFolio[], Error>({
    queryKey: [QUERY_KEYS.folio, params],
    queryFn: () => getArFolioList(params),
    enabled: params.ProfileId > 0,
    staleTime: 30000,
  });
}

export function useArFolioBalance(ProfileId: number) {
  return useQuery<
    {
      ProfileId: number;
      ProfileCode: string;
      ProfileName: string;
      Balance: number;
    },
    Error
  >({
    queryKey: [QUERY_KEYS.folioBalance, ProfileId],
    queryFn: () => getArFolioBalance(ProfileId),
    enabled: ProfileId > 0,
    staleTime: 60000,
  });
}

// ============================================================================
// AR Type Query Hook
// ============================================================================

export function useArTypeList() {
  return useQuery<
    Array<{
      ArTypeId: number;
      ArTypeName: string;
    }>,
    Error
  >({
    queryKey: [QUERY_KEYS.arTypeList],
    queryFn: getArTypeList,
    staleTime: 300000, // 5 minutes
  });
}

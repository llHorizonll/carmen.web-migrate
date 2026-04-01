/**
 * Standard Voucher (Template) Hooks
 * TanStack Query hooks for Standard Voucher operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  StandardVoucher,
  UriQueryString,
  PagingResult,
} from '../types';
import {
  getJvFrSearchList,
  getJvFrDetail,
  createJvFrDetail,
  updateJvFrDetail,
  delJvFrDetail,
} from '../services/generalLedger';

const QUERY_KEYS = {
  list: 'standardVoucherList',
  detail: 'standardVoucherDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useStandardVoucherList(params: UriQueryString) {
  return useQuery<PagingResult<StandardVoucher>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getJvFrSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useStandardVoucherDetail(FJvhSeq: number) {
  return useQuery<StandardVoucher, Error>({
    queryKey: [QUERY_KEYS.detail, FJvhSeq],
    queryFn: () => getJvFrDetail(FJvhSeq),
    enabled: FJvhSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateStandardVoucher() {
  const queryClient = useQueryClient();

  return useMutation<StandardVoucher, Error, Omit<StandardVoucher, 'FJvhSeq'>>({
    mutationFn: createJvFrDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Standard voucher created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create standard voucher',
        color: 'red',
      });
    },
  });
}

export function useUpdateStandardVoucher() {
  const queryClient = useQueryClient();

  return useMutation<StandardVoucher, Error, StandardVoucher>({
    mutationFn: updateJvFrDetail,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.FJvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'Standard voucher updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update standard voucher',
        color: 'red',
      });
    },
  });
}

export function useDeleteStandardVoucher() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: delJvFrDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Standard voucher deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete standard voucher',
        color: 'red',
      });
    },
  });
}

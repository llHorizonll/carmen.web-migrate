/**
 * AR Receipt Hooks
 * TanStack Query hooks for Accounts Receivable Receipt operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ArReceipt,
  ArReceiptFilterParams,
  PagingResult,
} from '../types';
import {
  getArReceiptSearchList,
  getArReceiptDetail,
  createArReceiptDetail,
  updateArReceiptDetail,
  delArReceiptDetail,
} from '../services/accountReceivable';

const QUERY_KEYS = {
  list: 'arReceiptList',
  detail: 'arReceiptDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useArReceiptList(params: ArReceiptFilterParams) {
  return useQuery<PagingResult<ArReceipt>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getArReceiptSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useArReceiptDetail(ArRcptSeq: number) {
  return useQuery<ArReceipt, Error>({
    queryKey: [QUERY_KEYS.detail, ArRcptSeq],
    queryFn: () => getArReceiptDetail(ArRcptSeq),
    enabled: ArRcptSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateArReceipt() {
  const queryClient = useQueryClient();

  return useMutation<ArReceipt, Error, Omit<ArReceipt, 'ArRcptSeq'>>({
    mutationFn: createArReceiptDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AR Receipt created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create AR receipt',
        color: 'red',
      });
    },
  });
}

export function useUpdateArReceipt() {
  const queryClient = useQueryClient();

  return useMutation<ArReceipt, Error, ArReceipt>({
    mutationFn: updateArReceiptDetail,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ArRcptSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'AR Receipt updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update AR receipt',
        color: 'red',
      });
    },
  });
}

export function useDeleteArReceipt() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { ArRcptSeq: number; username: string; remark: string }
  >({
    mutationFn: ({ ArRcptSeq, username, remark }) =>
      delArReceiptDetail(ArRcptSeq, username, remark),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AR Receipt voided successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to void AR receipt',
        color: 'red',
      });
    },
  });
}

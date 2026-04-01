/**
 * AR Invoice Hooks
 * TanStack Query hooks for Accounts Receivable Invoice operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ArInvoice,
  ArInvoiceFilterParams,
  PagingResult,
} from '../types';
import {
  getArInvoiceSearchList,
  getArInvoiceDetail,
  createArInvoice,
  updateArInvoice,
  deleteArInvoice,
  postArInvoice,
} from '../services/accountReceivable';

const QUERY_KEYS = {
  list: 'arInvoiceList',
  detail: 'arInvoiceDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useArInvoiceList(params: ArInvoiceFilterParams) {
  return useQuery<PagingResult<ArInvoice>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getArInvoiceSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useArInvoiceDetail(ArInvhSeq: number) {
  return useQuery<ArInvoice, Error>({
    queryKey: [QUERY_KEYS.detail, ArInvhSeq],
    queryFn: () => getArInvoiceDetail(ArInvhSeq),
    enabled: ArInvhSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateArInvoice() {
  const queryClient = useQueryClient();

  return useMutation<ArInvoice, Error, Omit<ArInvoice, 'ArInvhSeq'>>({
    mutationFn: createArInvoice,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AR Invoice created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create AR invoice',
        color: 'red',
      });
    },
  });
}

export function useUpdateArInvoice() {
  const queryClient = useQueryClient();

  return useMutation<ArInvoice, Error, ArInvoice>({
    mutationFn: updateArInvoice,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ArInvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'AR Invoice updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update AR invoice',
        color: 'red',
      });
    },
  });
}

export function useDeleteArInvoice() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { ArInvhSeq: number; username: string; remark: string }
  >({
    mutationFn: ({ ArInvhSeq, username, remark }) =>
      deleteArInvoice(ArInvhSeq, username, remark),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AR Invoice voided successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to void AR invoice',
        color: 'red',
      });
    },
  });
}

export function usePostArInvoice() {
  const queryClient = useQueryClient();

  return useMutation<ArInvoice, Error, number>({
    mutationFn: postArInvoice,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ArInvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'AR Invoice posted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to post AR invoice',
        color: 'red',
      });
    },
  });
}

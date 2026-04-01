/**
 * AP Invoice Hooks
 * TanStack Query hooks for Accounts Payable Invoice operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ApInvoice,
  ApInvoiceFilterParams,
  PagingResult,
} from '../types';
import {
  getApInvoiceSearchList,
  getApInvoiceDetail,
  createApInvoice,
  updateApInvoice,
  deleteApInvoice,
  postApInvoice,
} from '../services/accountPayable';

const QUERY_KEYS = {
  list: 'apInvoiceList',
  detail: 'apInvoiceDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useApInvoiceList(params: ApInvoiceFilterParams) {
  return useQuery<PagingResult<ApInvoice>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getApInvoiceSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useApInvoiceDetail(ApInvhSeq: number) {
  return useQuery<ApInvoice, Error>({
    queryKey: [QUERY_KEYS.detail, ApInvhSeq],
    queryFn: () => getApInvoiceDetail(ApInvhSeq),
    enabled: ApInvhSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateApInvoice() {
  const queryClient = useQueryClient();

  return useMutation<ApInvoice, Error, Omit<ApInvoice, 'ApInvhSeq'>>({
    mutationFn: createApInvoice,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AP Invoice created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create AP invoice',
        color: 'red',
      });
    },
  });
}

export function useUpdateApInvoice() {
  const queryClient = useQueryClient();

  return useMutation<ApInvoice, Error, ApInvoice>({
    mutationFn: updateApInvoice,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ApInvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'AP Invoice updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update AP invoice',
        color: 'red',
      });
    },
  });
}

export function useDeleteApInvoice() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { ApInvhSeq: number; username: string; remark: string }
  >({
    mutationFn: ({ ApInvhSeq, username, remark }) =>
      deleteApInvoice(ApInvhSeq, username, remark),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AP Invoice voided successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to void AP invoice',
        color: 'red',
      });
    },
  });
}

export function usePostApInvoice() {
  const queryClient = useQueryClient();

  return useMutation<ApInvoice, Error, number>({
    mutationFn: postApInvoice,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ApInvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'AP Invoice posted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to post AP invoice',
        color: 'red',
      });
    },
  });
}

/**
 * AP Payment Hooks
 * TanStack Query hooks for Accounts Payable Payment operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ApPayment,
  ApPaymentFilterParams,
  PagingResult,
} from '../types';
import {
  getApPaymentSearchList,
  getApPaymentDetail,
  createApPaymentDetail,
  updateApPaymentDetail,
  delApPaymentDetail,
} from '../services/accountPayable';

const QUERY_KEYS = {
  list: 'apPaymentList',
  detail: 'apPaymentDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useApPaymentList(params: ApPaymentFilterParams) {
  return useQuery<PagingResult<ApPayment>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getApPaymentSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useApPaymentDetail(ApPmtSeq: number) {
  return useQuery<ApPayment, Error>({
    queryKey: [QUERY_KEYS.detail, ApPmtSeq],
    queryFn: () => getApPaymentDetail(ApPmtSeq),
    enabled: ApPmtSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateApPayment() {
  const queryClient = useQueryClient();

  return useMutation<ApPayment, Error, Omit<ApPayment, 'ApPmtSeq'>>({
    mutationFn: createApPaymentDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AP Payment created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create AP payment',
        color: 'red',
      });
    },
  });
}

export function useUpdateApPayment() {
  const queryClient = useQueryClient();

  return useMutation<ApPayment, Error, ApPayment>({
    mutationFn: updateApPaymentDetail,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.ApPmtSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'AP Payment updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update AP payment',
        color: 'red',
      });
    },
  });
}

export function useDeleteApPayment() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { ApPmtSeq: number; username: string; remark: string }
  >({
    mutationFn: ({ ApPmtSeq, username, remark }) =>
      delApPaymentDetail(ApPmtSeq, username, remark),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'AP Payment voided successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to void AP payment',
        color: 'red',
      });
    },
  });
}

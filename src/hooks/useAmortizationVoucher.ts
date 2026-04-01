/**
 * Amortization Voucher Hooks
 * TanStack Query hooks for Amortization Voucher operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  AmortizationVoucher,
  UriQueryString,
  PagingResult,
} from '../types';
import {
  getAmortizeJvSearchList,
  getAmortizeStdJvDetail,
  createAmortizeStdJvDetail,
  updateAmortizeStdJvDetail,
  delAmortizeStdJvDetail,
  getAmortizeHistory,
} from '../services/generalLedger';

const QUERY_KEYS = {
  list: 'amortizationVoucherList',
  detail: 'amortizationVoucherDetail',
  history: 'amortizationHistory',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useAmortizationVoucherList(params: UriQueryString) {
  return useQuery<PagingResult<AmortizationVoucher>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getAmortizeJvSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useAmortizationVoucherDetail(FJvhSeq: number) {
  return useQuery<AmortizationVoucher, Error>({
    queryKey: [QUERY_KEYS.detail, FJvhSeq],
    queryFn: () => getAmortizeStdJvDetail(FJvhSeq),
    enabled: FJvhSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

export function useAmortizationHistory(Id: number) {
  return useQuery<unknown[], Error>({
    queryKey: [QUERY_KEYS.history, Id],
    queryFn: () => getAmortizeHistory(Id),
    enabled: Id > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateAmortizationVoucher() {
  const queryClient = useQueryClient();

  return useMutation<AmortizationVoucher, Error, Omit<AmortizationVoucher, 'FJvhSeq'>>({
    mutationFn: createAmortizeStdJvDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Amortization voucher created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create amortization voucher',
        color: 'red',
      });
    },
  });
}

export function useUpdateAmortizationVoucher() {
  const queryClient = useQueryClient();

  return useMutation<AmortizationVoucher, Error, AmortizationVoucher>({
    mutationFn: updateAmortizeStdJvDetail,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.FJvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'Amortization voucher updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update amortization voucher',
        color: 'red',
      });
    },
  });
}

export function useDeleteAmortizationVoucher() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: delAmortizeStdJvDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Amortization voucher deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete amortization voucher',
        color: 'red',
      });
    },
  });
}

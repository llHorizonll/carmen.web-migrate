/**
 * Journal Voucher Hooks
 * TanStack Query hooks for Journal Voucher operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  JournalVoucher,
  JvFilterParams,
  PagingResult,
} from '../types';
import {
  getJvSearchList,
  getJvDetail,
  createJvDetail,
  updateJvDetail,
  delJvDetail,
} from '../services/generalLedger';

const QUERY_KEYS = {
  list: 'jvList',
  detail: 'jvDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useJvList(params: JvFilterParams) {
  return useQuery<PagingResult<JournalVoucher>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getJvSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useJvDetail(JvhSeq: number) {
  return useQuery<JournalVoucher, Error>({
    queryKey: [QUERY_KEYS.detail, JvhSeq],
    queryFn: () => getJvDetail(JvhSeq),
    enabled: JvhSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateJv() {
  const queryClient = useQueryClient();

  return useMutation<JournalVoucher, Error, Omit<JournalVoucher, 'JvhSeq'>>({
    mutationFn: createJvDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Journal voucher created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create journal voucher',
        color: 'red',
      });
    },
  });
}

export function useUpdateJv() {
  const queryClient = useQueryClient();

  return useMutation<JournalVoucher, Error, JournalVoucher>({
    mutationFn: updateJvDetail,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.JvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'Journal voucher updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update journal voucher',
        color: 'red',
      });
    },
  });
}

export function useDeleteJv() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { JvhSeq: number; username: string; remark: string }
  >({
    mutationFn: ({ JvhSeq, username, remark }) =>
      delJvDetail(JvhSeq, username, remark),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Journal voucher voided successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to void journal voucher',
        color: 'red',
      });
    },
  });
}

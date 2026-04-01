/**
 * Allocation Voucher Hooks
 * TanStack Query hooks for Allocation Voucher operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  AllocationVoucher,
  AllocationJvFilterParams,
  PagingResult,
} from '../types';
import {
  getAllocationJvSearchList,
  getAllocationJvDetail,
  createAllocationJvDetail,
  updateAllocationJvDetail,
  delAllocationJvDetail,
} from '../services/generalLedger';

const QUERY_KEYS = {
  list: 'allocationVoucherList',
  detail: 'allocationVoucherDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useAllocationVoucherList(params: AllocationJvFilterParams) {
  return useQuery<PagingResult<AllocationVoucher>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getAllocationJvSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useAllocationVoucherDetail(AJvhSeq: number) {
  return useQuery<AllocationVoucher, Error>({
    queryKey: [QUERY_KEYS.detail, AJvhSeq],
    queryFn: () => getAllocationJvDetail(AJvhSeq),
    enabled: AJvhSeq > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateAllocationVoucher() {
  const queryClient = useQueryClient();

  return useMutation<AllocationVoucher, Error, Omit<AllocationVoucher, 'AJvhSeq'>>({
    mutationFn: createAllocationJvDetail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Allocation voucher created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create allocation voucher',
        color: 'red',
      });
    },
  });
}

export function useUpdateAllocationVoucher() {
  const queryClient = useQueryClient();

  return useMutation<AllocationVoucher, Error, AllocationVoucher>({
    mutationFn: updateAllocationJvDetail,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.AJvhSeq],
      });
      notifications.show({
        title: 'Success',
        message: 'Allocation voucher updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update allocation voucher',
        color: 'red',
      });
    },
  });
}

export function useDeleteAllocationVoucher() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { AJvhSeq: number; username: string; remark: string }
  >({
    mutationFn: ({ AJvhSeq, username, remark }) =>
      delAllocationJvDetail(AJvhSeq, username, remark),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Allocation voucher voided successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to void allocation voucher',
        color: 'red',
      });
    },
  });
}

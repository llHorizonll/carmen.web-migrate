/**
 * AP Vendor Hooks
 * TanStack Query hooks for Accounts Payable Vendor operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ApVendor,
  ApVendorFilterParams,
  PagingResult,
} from '../types';
import {
  getVendorList,
  getVendorDetail,
  createVendor,
  updateVendor,
  deleteVendor,
} from '../services/accountPayable';

const QUERY_KEYS = {
  list: 'apVendorList',
  detail: 'apVendorDetail',
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

export function useApVendorList(params: ApVendorFilterParams) {
  return useQuery<PagingResult<ApVendor>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getVendorList(params),
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
  });
}

export function useApVendorDetail(VendorId: number) {
  return useQuery<ApVendor, Error>({
    queryKey: [QUERY_KEYS.detail, VendorId],
    queryFn: () => getVendorDetail(VendorId),
    enabled: VendorId > 0,
    staleTime: 60000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateApVendor() {
  const queryClient = useQueryClient();

  return useMutation<ApVendor, Error, Omit<ApVendor, 'VendorId'>>({
    mutationFn: createVendor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Vendor created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create vendor',
        color: 'red',
      });
    },
  });
}

export function useUpdateApVendor() {
  const queryClient = useQueryClient();

  return useMutation<ApVendor, Error, ApVendor>({
    mutationFn: updateVendor,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.VendorId],
      });
      notifications.show({
        title: 'Success',
        message: 'Vendor updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update vendor',
        color: 'red',
      });
    },
  });
}

export function useDeleteApVendor() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteVendor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Vendor deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete vendor',
        color: 'red',
      });
    },
  });
}
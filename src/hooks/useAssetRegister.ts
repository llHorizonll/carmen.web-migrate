/**
 * Asset Register Hooks
 * TanStack Query hooks for Asset Register operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  AssetRegister,
  AssetFilterParams,
  PagingResult,
} from '../types';
import {
  getAssetRegisterSearchList,
  getAssetRegisterDetail,
  createAssetRegister,
  updateAssetRegister,
  getPreAssetSearchList,
  getPreAssetDetail,
  createPreAsset,
  updatePreAsset,
  getAssetDisposalSearchList,
  getAssetDisposalDetail,
  createAssetDisposal,
  updateAssetDisposal,
} from '../services/asset';

const QUERY_KEYS = {
  assetList: 'assetRegisterList',
  assetDetail: 'assetRegisterDetail',
  preAssetList: 'preAssetList',
  preAssetDetail: 'preAssetDetail',
  disposalList: 'assetDisposalList',
  disposalDetail: 'assetDisposalDetail',
} as const;

// ============================================================================
// Asset Register Query Hooks
// ============================================================================

export function useAssetRegisterList(params: AssetFilterParams) {
  return useQuery<PagingResult<AssetRegister>, Error>({
    queryKey: [QUERY_KEYS.assetList, params],
    queryFn: () => getAssetRegisterSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useAssetRegisterDetail(AssetId: number) {
  return useQuery<AssetRegister, Error>({
    queryKey: [QUERY_KEYS.assetDetail, AssetId],
    queryFn: () => getAssetRegisterDetail(AssetId),
    enabled: AssetId > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Pre-Asset Query Hooks
// ============================================================================

export function usePreAssetList(params: AssetFilterParams) {
  return useQuery<PagingResult<AssetRegister>, Error>({
    queryKey: [QUERY_KEYS.preAssetList, params],
    queryFn: () => getPreAssetSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function usePreAssetDetail(AssetId: number) {
  return useQuery<AssetRegister, Error>({
    queryKey: [QUERY_KEYS.preAssetDetail, AssetId],
    queryFn: () => getPreAssetDetail(AssetId),
    enabled: AssetId > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Asset Disposal Query Hooks
// ============================================================================

export function useAssetDisposalList(params: AssetFilterParams) {
  return useQuery<PagingResult<AssetRegister>, Error>({
    queryKey: [QUERY_KEYS.disposalList, params],
    queryFn: () => getAssetDisposalSearchList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useAssetDisposalDetail(AssetId: number) {
  return useQuery<AssetRegister, Error>({
    queryKey: [QUERY_KEYS.disposalDetail, AssetId],
    queryFn: () => getAssetDisposalDetail(AssetId),
    enabled: AssetId > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Asset Register Mutation Hooks
// ============================================================================

export function useCreateAssetRegister() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, Omit<AssetRegister, 'AssetId'>>({
    mutationFn: createAssetRegister,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.assetList] });
      notifications.show({
        title: 'Success',
        message: 'Asset created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create asset',
        color: 'red',
      });
    },
  });
}

export function useUpdateAssetRegister() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, AssetRegister>({
    mutationFn: updateAssetRegister,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.assetList] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.assetDetail, data.AssetId],
      });
      notifications.show({
        title: 'Success',
        message: 'Asset updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update asset',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// Pre-Asset Mutation Hooks
// ============================================================================

export function useCreatePreAsset() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, Omit<AssetRegister, 'AssetId'>>({
    mutationFn: createPreAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.preAssetList] });
      notifications.show({
        title: 'Success',
        message: 'Pre-asset created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create pre-asset',
        color: 'red',
      });
    },
  });
}

export function useUpdatePreAsset() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, AssetRegister>({
    mutationFn: updatePreAsset,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.preAssetList] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.preAssetDetail, data.AssetId],
      });
      notifications.show({
        title: 'Success',
        message: 'Pre-asset updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update pre-asset',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// Asset Disposal Mutation Hooks
// ============================================================================

export function useCreateAssetDisposal() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, Omit<AssetRegister, 'AssetId'>>({
    mutationFn: createAssetDisposal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disposalList] });
      notifications.show({
        title: 'Success',
        message: 'Asset disposal created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create asset disposal',
        color: 'red',
      });
    },
  });
}

export function useUpdateAssetDisposal() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, AssetRegister>({
    mutationFn: updateAssetDisposal,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disposalList] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.disposalDetail, data.AssetId],
      });
      notifications.show({
        title: 'Success',
        message: 'Asset disposal updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update asset disposal',
        color: 'red',
      });
    },
  });
}

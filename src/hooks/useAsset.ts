/**
 * Asset Hooks
 * TanStack Query hooks for Asset Management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  AssetRegister,
  AssetFilterParams,
  PagingResult,
} from '../types';
import {
  getAssetList,
  getAssetDetail,
  createAsset,
  updateAsset,
  deleteAsset,
  runDepreciation,
  getDepreciationHistory,
  disposeAsset,
  transferAsset,
  getAssetCategoryList,
  getAssetLocationList,
} from '../services/asset';

const QUERY_KEYS = {
  list: 'assetList',
  detail: 'assetDetail',
  depreciationHistory: 'depreciationHistory',
  categoryList: 'assetCategoryList',
  locationList: 'assetLocationList',
} as const;

// ============================================================================
// Asset Query Hooks
// ============================================================================

export function useAssetList(params: AssetFilterParams) {
  return useQuery<PagingResult<AssetRegister>, Error>({
    queryKey: [QUERY_KEYS.list, params],
    queryFn: () => getAssetList(params),
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

export function useAssetDetail(AssetId: number) {
  return useQuery<AssetRegister, Error>({
    queryKey: [QUERY_KEYS.detail, AssetId],
    queryFn: () => getAssetDetail(AssetId),
    enabled: AssetId > 0,
    staleTime: 60000, // 1 minute
  });
}

// ============================================================================
// Asset Mutation Hooks
// ============================================================================

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, Omit<AssetRegister, 'AssetId'>>({
    mutationFn: createAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
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

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation<AssetRegister, Error, AssetRegister>({
    mutationFn: updateAsset,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.AssetId],
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

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Asset deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete asset',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// Depreciation Hooks
// ============================================================================

export function useDepreciationHistory(AssetId: number) {
  return useQuery<
    Array<{
      DepreciationId: number;
      AssetId: number;
      Year: number;
      Period: number;
      DepreciationAmount: number;
      AccumulatedDepreciation: number;
      NetBookValue: number;
    }>,
    Error
  >({
    queryKey: [QUERY_KEYS.depreciationHistory, AssetId],
    queryFn: () => getDepreciationHistory(AssetId),
    enabled: AssetId > 0,
    staleTime: 60000,
  });
}

export function useRunDepreciation() {
  const queryClient = useQueryClient();

  return useMutation<
    {
      Year: number;
      Period: number;
      DepreciationCount: number;
      TotalAmount: number;
    },
    Error,
    { year: number; period: number }
  >({
    mutationFn: ({ year, period }) => runDepreciation(year, period),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      notifications.show({
        title: 'Success',
        message: 'Depreciation run completed successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to run depreciation',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// Asset Disposal Hook
// ============================================================================

export function useDisposeAsset() {
  const queryClient = useQueryClient();

  return useMutation<
    AssetRegister,
    Error,
    {
      assetId: number;
      disposalDate: string;
      disposalAmount: number;
      reason?: string;
    }
  >({
    mutationFn: ({ assetId, disposalDate, disposalAmount, reason }) => disposeAsset(assetId, disposalDate, disposalAmount, reason),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.AssetId],
      });
      notifications.show({
        title: 'Success',
        message: 'Asset disposed successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to dispose asset',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// Asset Transfer Hook
// ============================================================================

export function useTransferAsset() {
  const queryClient = useQueryClient();

  return useMutation<
    AssetRegister,
    Error,
    {
      assetId: number;
      newDepartmentId: number;
      newLocationId?: number;
      transferDate?: string;
    }
  >({
    mutationFn: ({ assetId, newDepartmentId, newLocationId, transferDate }) => transferAsset(assetId, newDepartmentId, newLocationId, transferDate),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.list] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.detail, data.AssetId],
      });
      notifications.show({
        title: 'Success',
        message: 'Asset transferred successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to transfer asset',
        color: 'red',
      });
    },
  });
}

// ============================================================================
// Lookup Query Hooks
// ============================================================================

export function useAssetCategoryList() {
  return useQuery<
    Array<{
      CategoryId: number;
      CategoryName: string;
      DepreciationMethod: string;
      UsefulLife: number;
    }>,
    Error
  >({
    queryKey: [QUERY_KEYS.categoryList],
    queryFn: getAssetCategoryList,
    staleTime: 300000, // 5 minutes
  });
}

export function useAssetLocationList() {
  return useQuery<
    Array<{
      LocationId: number;
      LocationName: string;
    }>,
    Error
  >({
    queryKey: [QUERY_KEYS.locationList],
    queryFn: getAssetLocationList,
    staleTime: 300000, // 5 minutes
  });
}

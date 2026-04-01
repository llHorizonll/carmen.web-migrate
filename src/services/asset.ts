/**
 * Asset Management Services
 * Based on original src/services/asset.js
 * Preserves exact API behavior, adds TypeScript types
 */

import axiosAuth from '../utils/request';
import type {
  AssetRegister,
} from '../types/models';
import type {
  AssetFilterParams,
  PagingResult,
} from '../types/api';

// ============================================================================
// Asset Register APIs
// ============================================================================

export async function getAssetList(
  params: AssetFilterParams
): Promise<PagingResult<AssetRegister>> {
  const { data } = await axiosAuth.post('/api/asset/search', params);
  return data;
}

export async function getAssetDetail(AssetId: number): Promise<AssetRegister> {
  const { data } = await axiosAuth.get(`/api/asset/${AssetId}`);
  return data;
}

export async function createAsset(
  param: Omit<AssetRegister, 'AssetId'>
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/asset', param);
  return data;
}

export async function updateAsset(param: AssetRegister): Promise<AssetRegister> {
  const { data } = await axiosAuth.put(`/api/asset/${param.AssetId}`, param);
  return data;
}

export async function deleteAsset(AssetId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/asset/${AssetId}`);
  return data;
}

// ============================================================================
// Asset Depreciation APIs
// ============================================================================

export async function runDepreciation(
  year: number,
  period: number
): Promise<{
  Year: number;
  Period: number;
  DepreciationCount: number;
  TotalAmount: number;
}> {
  const { data } = await axiosAuth.post('/api/asset/depreciation/run', {
    Year: year,
    Period: period,
  });
  return data;
}

export async function getDepreciationHistory(
  assetId: number
): Promise<
  Array<{
    DepreciationId: number;
    AssetId: number;
    Year: number;
    Period: number;
    DepreciationAmount: number;
    AccumulatedDepreciation: number;
    NetBookValue: number;
  }>
> {
  const { data } = await axiosAuth.get(`/api/asset/depreciation/history/${assetId}`);
  return data;
}

// ============================================================================
// Asset Disposal APIs
// ============================================================================

export async function disposeAsset(
  assetId: number,
  disposalDate: string,
  disposalAmount: number,
  reason?: string
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/asset/dispose', {
    AssetId: assetId,
    DisposalDate: disposalDate,
    DisposalAmount: disposalAmount,
    Reason: reason,
  });
  return data;
}

// ============================================================================
// Asset Transfer APIs
// ============================================================================

export async function transferAsset(
  assetId: number,
  newDepartmentId: number,
  newLocationId?: number,
  transferDate?: string
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/asset/transfer', {
    AssetId: assetId,
    NewDepartmentId: newDepartmentId,
    NewLocationId: newLocationId,
    TransferDate: transferDate,
  });
  return data;
}

// ============================================================================
// Asset Category APIs
// ============================================================================

export async function getAssetCategoryList(): Promise<
  Array<{
    CategoryId: number;
    CategoryName: string;
    DepreciationMethod: string;
    UsefulLife: number;
  }>
> {
  const { data } = await axiosAuth.get('/api/assetCategory');
  return data;
}

// ============================================================================
// Asset Location APIs
// ============================================================================

export async function getAssetLocationList(): Promise<
  Array<{
    LocationId: number;
    LocationName: string;
  }>
> {
  const { data } = await axiosAuth.get('/api/assetLocation');
  return data;
}

// ============================================================================
// Asset Reports APIs
// ============================================================================

export async function getAssetRegisterReport(
  asOfDate: string,
  categoryId?: number,
  departmentId?: number
): Promise<unknown[]> {
  const params = new URLSearchParams();
  params.append('asOfDate', asOfDate);
  if (categoryId) {
    params.append('categoryId', categoryId.toString());
  }
  if (departmentId) {
    params.append('departmentId', departmentId.toString());
  }
  const { data } = await axiosAuth.get(`/api/asset/report/register?${params.toString()}`);
  return data;
}

export async function getAssetDepreciationReport(
  year: number,
  period: number
): Promise<unknown[]> {
  const { data } = await axiosAuth.get(`/api/asset/report/depreciation?year=${year}&period=${period}`);
  return data;
}

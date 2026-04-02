/**
 * Asset Management Services
 * Based on original src/services/asset.js
 * Preserves exact API behavior, adds TypeScript types
 * 
 * API Endpoints (per requirements):
 * - /api/assetRegister/search
 * - /api/assetPreAsset/search
 * - /api/assetDisposal/search
 */

import axiosAuth from '../utils/request';
import type {
  AssetRegister,
} from '../types/models';
import type {
  AssetFilterParams,
  PagingResult,
  UriQueryString,
} from '../types/api';

// ============================================================================
// Asset Register APIs
// ============================================================================

/**
 * POST /api/assetRegister/search
 */
export async function getAssetList(
  params: AssetFilterParams
): Promise<PagingResult<AssetRegister>> {
  const { data } = await axiosAuth.post('/api/assetRegister/search', params);
  return data;
}

export async function getAssetDetail(AssetId: number): Promise<AssetRegister> {
  const { data } = await axiosAuth.get(`/api/assetRegister/${AssetId}`);
  return data;
}

export async function createAsset(
  param: Omit<AssetRegister, 'AssetId'>
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/assetRegister', param);
  return data;
}

export async function updateAsset(param: AssetRegister): Promise<AssetRegister> {
  const { data } = await axiosAuth.put(`/api/assetRegister/${param.AssetId}`, param);
  return data;
}

export async function deleteAsset(AssetId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/assetRegister/${AssetId}`);
  return data;
}

// ============================================================================
// Asset Pre-Asset (Pre-Registration) APIs
// ============================================================================

/**
 * POST /api/assetPreAsset/search
 */
export async function getPreAssetSearchList(
  params: UriQueryString
): Promise<PagingResult<unknown>> {
  const { data } = await axiosAuth.post('/api/assetPreAsset/search', params);
  return data;
}

export async function getPreAssetDetail(PreAssetId: number): Promise<unknown> {
  const { data } = await axiosAuth.get(`/api/assetPreAsset/${PreAssetId}`);
  return data;
}

export async function createPreAsset(param: unknown): Promise<unknown> {
  const { data } = await axiosAuth.post('/api/assetPreAsset', param);
  return data;
}

export async function updatePreAsset(param: { PreAssetId: number; [key: string]: unknown }): Promise<unknown> {
  const { data } = await axiosAuth.put(`/api/assetPreAsset/${param.PreAssetId}`, param);
  return data;
}

export async function deletePreAsset(PreAssetId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/assetPreAsset/${PreAssetId}`);
  return data;
}

export async function approvePreAsset(PreAssetId: number): Promise<unknown> {
  const { data } = await axiosAuth.post(`/api/assetPreAsset/approve/${PreAssetId}`);
  return data;
}

// ============================================================================
// Asset Disposal APIs
// ============================================================================

/**
 * POST /api/assetDisposal/search
 */
export async function getAssetDisposalSearchList(
  params: UriQueryString
): Promise<PagingResult<unknown>> {
  const { data } = await axiosAuth.post('/api/assetDisposal/search', params);
  return data;
}

export async function getAssetDisposalDetail(DisposalId: number): Promise<unknown> {
  const { data } = await axiosAuth.get(`/api/assetDisposal/${DisposalId}`);
  return data;
}

export async function createAssetDisposal(param: {
  AssetId: number;
  DisposalDate: string;
  DisposalAmount: number;
  Reason?: string;
}): Promise<unknown> {
  const { data } = await axiosAuth.post('/api/assetDisposal', param);
  return data;
}

export async function updateAssetDisposal(param: { DisposalId: number; [key: string]: unknown }): Promise<unknown> {
  const { data } = await axiosAuth.put(`/api/assetDisposal/${param.DisposalId}`, param);
  return data;
}

export async function deleteAssetDisposal(DisposalId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/assetDisposal/${DisposalId}`);
  return data;
}

export async function postAssetDisposal(DisposalId: number): Promise<unknown> {
  const { data } = await axiosAuth.post(`/api/assetDisposal/post/${DisposalId}`);
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
  const { data } = await axiosAuth.post('/api/assetRegister/depreciation/run', {
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
  const { data } = await axiosAuth.get(`/api/assetRegister/depreciation/history/${assetId}`);
  return data;
}

// ============================================================================
// Asset Disposal (Legacy - for backward compatibility)
// ============================================================================

export async function disposeAsset(
  assetId: number,
  disposalDate: string,
  disposalAmount: number,
  reason?: string
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/assetRegister/dispose', {
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
  const { data } = await axiosAuth.post('/api/assetRegister/transfer', {
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
  const { data } = await axiosAuth.get(`/api/assetRegister/report/register?${params.toString()}`);
  return data;
}

export async function getAssetDepreciationReport(
  year: number,
  period: number
): Promise<unknown[]> {
  const { data } = await axiosAuth.get(`/api/assetRegister/report/depreciation?year=${year}&period=${period}`);
  return data;
}

/**
 * Asset Management Services
 * Based on original src/services/asset.js
 * Preserves exact API behavior, adds TypeScript types
 */

import axiosAuth from '../utils/request';
import type { AssetRegister } from '../types/models';
import type { AssetFilterParams, PagingResult } from '../types/api';

// ============================================================================
// Asset Register APIs
// ============================================================================

export async function getAssetRegisterSearchList(
  params: AssetFilterParams
): Promise<PagingResult<AssetRegister>> {
  const { data } = await axiosAuth.post('/api/assetRegister/search', params);
  return data;
}

export async function getAssetRegisterDetail(
  AssetId: number
): Promise<AssetRegister> {
  const { data } = await axiosAuth.get(`/api/assetRegister/${AssetId}`);
  return data;
}

export async function createAssetRegister(
  param: Omit<AssetRegister, 'AssetId'>
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/assetRegister', param);
  return data;
}

export async function updateAssetRegister(
  param: AssetRegister
): Promise<AssetRegister> {
  const { data } = await axiosAuth.put(
    `/api/assetRegister/${param.AssetId}`,
    param
  );
  return data;
}

// ============================================================================
// Asset Disposal APIs
// ============================================================================

export async function getAssetDisposalSearchList(
  params: AssetFilterParams
): Promise<PagingResult<AssetRegister>> {
  const { data } = await axiosAuth.post('/api/assetDisposal/search', params);
  return data;
}

export async function getAssetDisposalDetail(
  AssetId: number
): Promise<AssetRegister> {
  const { data } = await axiosAuth.get(`/api/assetDisposal/${AssetId}`);
  return data;
}

export async function createAssetDisposal(
  param: Omit<AssetRegister, 'AssetId'>
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/assetDisposal', param);
  return data;
}

export async function updateAssetDisposal(
  param: AssetRegister
): Promise<AssetRegister> {
  const { data } = await axiosAuth.put(
    `/api/assetDisposal/${param.AssetId}`,
    param
  );
  return data;
}

// ============================================================================
// Pre-Asset APIs
// ============================================================================

export async function getPreAssetSearchList(
  params: AssetFilterParams
): Promise<PagingResult<AssetRegister>> {
  const { data } = await axiosAuth.post('/api/preAsset/search', params);
  return data;
}

export async function getPreAssetDetail(AssetId: number): Promise<AssetRegister> {
  const { data } = await axiosAuth.get(`/api/preAsset/${AssetId}`);
  return data;
}

export async function createPreAsset(
  param: Omit<AssetRegister, 'AssetId'>
): Promise<AssetRegister> {
  const { data } = await axiosAuth.post('/api/preAsset', param);
  return data;
}

export async function updatePreAsset(
  param: AssetRegister
): Promise<AssetRegister> {
  const { data } = await axiosAuth.put(
    `/api/preAsset/${param.AssetId}`,
    param
  );
  return data;
}

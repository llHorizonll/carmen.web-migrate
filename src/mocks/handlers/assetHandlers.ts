/**
 * Asset Module MSW Handlers
 * Intercepts Asset API requests and returns mock data
 */

import { http, HttpResponse, delay } from 'msw';
import { stores } from '../store/stores';
import type { 
  AssetRegister, 
  UriQueryString,
  PagingResult 
} from '../../types';

const API_BASE = '/api';

// Helper to create paginated response
const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PagingResult<T> => ({
  Data: data,
  Total: total,
  Page: page,
  PageSize: limit,
  TotalPages: Math.ceil(total / limit),
});

// ============================================================================
// Asset Register Handlers
// ============================================================================

export const assetRegisterHandlers = [
  // Search/List
  http.post(`${API_BASE}/assetReg/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    // Active assets (not pre-assets)
    const result = stores.asset.register.search(
      () => true,
      page,
      limit
    );
    
    return HttpResponse.json(createPaginatedResponse(
      result.data,
      page,
      limit,
      result.total
    ));
  }),

  // Get Detail
  http.get(`${API_BASE}/assetReg/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const asset = stores.asset.register.getById(id);
    
    if (!asset) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(asset);
  }),

  // Create
  http.post(`${API_BASE}/assetReg`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<AssetRegister, 'AssetId'>;
    const newAsset = stores.asset.register.create(body);
    return HttpResponse.json(newAsset, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/assetReg/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<AssetRegister>;
    const updated = stores.asset.register.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete
  http.delete(`${API_BASE}/assetReg/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const deleted = stores.asset.register.delete(id);
    
    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Generate Asset Code
  http.get(`${API_BASE}/assetReg/nextNo`, async () => {
    await delay(100);
    const allAssets = stores.asset.register.getAll();
    const maxNo = allAssets.reduce((max: number, asset: AssetRegister) => {
      const match = asset.AssetCode.match(/AST-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return HttpResponse.json({ AssetCode: `AST-${String(maxNo + 1).padStart(4, '0')}` });
  }),
];

// ============================================================================
// Pre-Asset Handlers
// ============================================================================

export const preAssetHandlers = [
  // Search/List
  http.post(`${API_BASE}/assetPre/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.asset.preAsset.search(
      () => true,
      page,
      limit
    );
    
    return HttpResponse.json(createPaginatedResponse(
      result.data,
      page,
      limit,
      result.total
    ));
  }),

  // Get Detail
  http.get(`${API_BASE}/assetPre/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const asset = stores.asset.preAsset.getById(id);
    
    if (!asset) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(asset);
  }),

  // Create
  http.post(`${API_BASE}/assetPre`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<AssetRegister, 'AssetId'>;
    const newAsset = stores.asset.preAsset.create(body);
    return HttpResponse.json(newAsset, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/assetPre/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<AssetRegister>;
    const updated = stores.asset.preAsset.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete
  http.delete(`${API_BASE}/assetPre/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const deleted = stores.asset.preAsset.delete(id);
    
    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Activate Pre-Asset (convert to Asset Register)
  http.post(`${API_BASE}/assetPre/activate/:id`, async ({ params, request }) => {
    await delay(500);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as { AssetCode: string };
    
    const preAsset = stores.asset.preAsset.getById(id);
    if (!preAsset) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Move from pre-asset store to register store
    const activatedAsset = stores.asset.register.create({
      ...preAsset,
      AssetCode: body.AssetCode,
      Status: 'Active',
    });
    
    // Remove from pre-asset store
    stores.asset.preAsset.delete(id);
    
    return HttpResponse.json(activatedAsset);
  }),
];

// ============================================================================
// Asset Disposal Handlers
// ============================================================================

export const assetDisposalHandlers = [
  // Search/List
  http.post(`${API_BASE}/assetDisposal/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    // Get all assets with Disposed status
    const result = stores.asset.register.search(
      (item: AssetRegister) => item.Status === 'Disposed',
      page,
      limit
    );
    
    return HttpResponse.json(createPaginatedResponse(
      result.data,
      page,
      limit,
      result.total
    ));
  }),

  // Get Detail
  http.get(`${API_BASE}/assetDisposal/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const asset = stores.asset.register.getById(id);
    
    if (!asset || asset.Status !== 'Disposed') {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(asset);
  }),

  // Dispose Asset
  http.post(`${API_BASE}/assetReg/dispose/:id`, async ({ params }) => {
    await delay(500);
    const id = parseInt(params.id as string, 10);
    
    const asset = stores.asset.register.getById(id);
    if (!asset) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const updated = stores.asset.register.update(id, {
      Status: 'Disposed',
    } as Partial<AssetRegister>);
    
    return HttpResponse.json(updated);
  }),
];

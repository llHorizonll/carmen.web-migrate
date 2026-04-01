/**
 * GL Module MSW Handlers
 * Intercepts GL API requests and returns mock data
 */

import { http, HttpResponse, delay } from 'msw';
import { stores } from '../store/stores';
import type { 
  JournalVoucher, 
  AllocationVoucher, 
  StandardVoucher, 
  AmortizationVoucher,
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
// Journal Voucher Handlers
// ============================================================================

export const journalVoucherHandlers = [
  // Search/List
  http.post(`${API_BASE}/glJv/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.gl.journalVoucher.search(
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
  http.get(`${API_BASE}/glJv/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const voucher = stores.gl.journalVoucher.getById(id);
    
    if (!voucher) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(voucher);
  }),

  // Create
  http.post(`${API_BASE}/glJv`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<JournalVoucher, 'JvhSeq'>;
    const newVoucher = stores.gl.journalVoucher.create(body);
    return HttpResponse.json(newVoucher, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/glJv/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<JournalVoucher>;
    const updated = stores.gl.journalVoucher.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete (Void)
  http.delete(`${API_BASE}/glJv/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const voided = stores.gl.journalVoucher.void(id, {
      Status: 'Void',
    } as Partial<JournalVoucher>);
    
    if (!voided) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================================================
// Allocation Voucher Handlers
// ============================================================================

export const allocationVoucherHandlers = [
  // Search/List
  http.post(`${API_BASE}/allocationJv/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.gl.allocationVoucher.search(
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
  http.get(`${API_BASE}/allocationJv/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const voucher = stores.gl.allocationVoucher.getById(id);
    
    if (!voucher) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(voucher);
  }),

  // Create
  http.post(`${API_BASE}/allocationJv`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<AllocationVoucher, 'AJvhSeq'>;
    const newVoucher = stores.gl.allocationVoucher.create(body);
    return HttpResponse.json(newVoucher, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/allocationJv/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<AllocationVoucher>;
    const updated = stores.gl.allocationVoucher.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete (Void)
  http.delete(`${API_BASE}/allocationJv/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const voided = stores.gl.allocationVoucher.void(id, {
      Status: 'Void',
    } as Partial<AllocationVoucher>);
    
    if (!voided) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================================================
// Standard Voucher (Template) Handlers
// ============================================================================

export const standardVoucherHandlers = [
  // Search/List
  http.post(`${API_BASE}/glJvFr/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.gl.standardVoucher.search(
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
  http.get(`${API_BASE}/glJvFr/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const voucher = stores.gl.standardVoucher.getById(id);
    
    if (!voucher) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(voucher);
  }),

  // Create
  http.post(`${API_BASE}/glJvFr`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<StandardVoucher, 'FJvhSeq'>;
    const newVoucher = stores.gl.standardVoucher.create(body);
    return HttpResponse.json(newVoucher, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/glJvFr/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<StandardVoucher>;
    const updated = stores.gl.standardVoucher.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete
  http.delete(`${API_BASE}/glJvFr/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const deleted = stores.gl.standardVoucher.delete(id);
    
    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================================================
// Amortization Voucher Handlers
// ============================================================================

export const amortizationVoucherHandlers = [
  // Search/List
  http.post(`${API_BASE}/amortizeStdJv/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.gl.amortizationVoucher.search(
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
  http.get(`${API_BASE}/amortizeStdJv/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const voucher = stores.gl.amortizationVoucher.getById(id);
    
    if (!voucher) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(voucher);
  }),

  // Create
  http.post(`${API_BASE}/amortizeStdJv`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<AmortizationVoucher, 'FJvhSeq'>;
    const newVoucher = stores.gl.amortizationVoucher.create(body);
    return HttpResponse.json(newVoucher, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/amortizeStdJv/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<AmortizationVoucher>;
    const updated = stores.gl.amortizationVoucher.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete
  http.delete(`${API_BASE}/amortizeStdJv/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const deleted = stores.gl.amortizationVoucher.delete(id);
    
    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];

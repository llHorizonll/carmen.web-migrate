/**
 * AR Module MSW Handlers
 * Intercepts AR API requests and returns mock data
 */

import { http, HttpResponse, delay } from 'msw';
import { stores } from '../store/stores';
import type { 
  ArInvoice, 
  ArReceipt, 
  ArProfile,
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
// AR Invoice Handlers
// ============================================================================

export const arInvoiceHandlers = [
  // Search/List
  http.post(`${API_BASE}/arInvh/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.ar.invoice.search(
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
  http.get(`${API_BASE}/arInvh/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const invoice = stores.ar.invoice.getById(id);
    
    if (!invoice) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(invoice);
  }),

  // Create
  http.post(`${API_BASE}/arInvh`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<ArInvoice, 'ArInvhSeq'>;
    const newInvoice = stores.ar.invoice.create(body);
    return HttpResponse.json(newInvoice, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/arInvh/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<ArInvoice>;
    const updated = stores.ar.invoice.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete (Void)
  http.delete(`${API_BASE}/arInvh/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const voided = stores.ar.invoice.void(id, {
      Status: 'Void',
    } as Partial<ArInvoice>);
    
    if (!voided) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Get Next Invoice No
  http.get(`${API_BASE}/arInvh/nextNo`, async () => {
    await delay(100);
    const allInvoices = stores.ar.invoice.getAll();
    const maxNo = allInvoices.reduce((max: number, inv: ArInvoice) => {
      const match = inv.InvNo.match(/ARINV-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return HttpResponse.json({ InvNo: `ARINV-${String(maxNo + 1).padStart(4, '0')}` });
  }),
];

// ============================================================================
// AR Receipt Handlers
// ============================================================================

export const arReceiptHandlers = [
  // Search/List
  http.post(`${API_BASE}/arRcpt/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.ar.receipt.search(
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
  http.get(`${API_BASE}/arRcpt/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const receipt = stores.ar.receipt.getById(id);
    
    if (!receipt) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(receipt);
  }),

  // Create
  http.post(`${API_BASE}/arRcpt`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<ArReceipt, 'ArRcptSeq'>;
    const newReceipt = stores.ar.receipt.create(body);
    return HttpResponse.json(newReceipt, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/arRcpt/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<ArReceipt>;
    const updated = stores.ar.receipt.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete (Void)
  http.delete(`${API_BASE}/arRcpt/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const voided = stores.ar.receipt.void(id, {
      Status: 'Void',
    } as Partial<ArReceipt>);
    
    if (!voided) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================================================
// AR Profile Handlers
// ============================================================================

export const arProfileHandlers = [
  // Search/List
  http.post(`${API_BASE}/arProfile/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.ar.profile.search(
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

  // Get All Profiles (for lookup)
  http.get(`${API_BASE}/arProfile`, async () => {
    await delay(200);
    const profiles = stores.ar.profile.getAll();
    return HttpResponse.json(profiles);
  }),

  // Get Detail
  http.get(`${API_BASE}/arProfile/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const profile = stores.ar.profile.getById(id);
    
    if (!profile) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(profile);
  }),

  // Create
  http.post(`${API_BASE}/arProfile`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as ArProfile;
    const newProfile = stores.ar.profile.create(body);
    return HttpResponse.json(newProfile, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/arProfile/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<ArProfile>;
    const updated = stores.ar.profile.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete
  http.delete(`${API_BASE}/arProfile/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const deleted = stores.ar.profile.delete(id);
    
    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Profile Lookup
  http.get(`${API_BASE}/arProfile/lookup/:search`, async ({ params }) => {
    await delay(150);
    const search = (params.search as string).toLowerCase();
    const profiles = stores.ar.profile.search((item: ArProfile) =>
      item.ProfileCode.toLowerCase().includes(search) ||
      item.ProfileName.toLowerCase().includes(search)
    ).data.slice(0, 10);
    
    return HttpResponse.json(profiles);
  }),
];

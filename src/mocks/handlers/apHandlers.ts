/**
 * AP Module MSW Handlers
 * Intercepts AP API requests and returns mock data
 */

import { http, HttpResponse, delay } from 'msw';
import { stores } from '../store/stores';
import type { 
  ApInvoice, 
  ApPayment, 
  ApVendor,
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
// AP Invoice Handlers
// ============================================================================

export const apInvoiceHandlers = [
  // Search/List
  http.post(`${API_BASE}/apInvh/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.ap.invoice.search(
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
  http.get(`${API_BASE}/apInvh/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const invoice = stores.ap.invoice.getById(id);
    
    if (!invoice) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(invoice);
  }),

  // Create
  http.post(`${API_BASE}/apInvh`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<ApInvoice, 'ApInvhSeq'>;
    const newInvoice = stores.ap.invoice.create(body);
    return HttpResponse.json(newInvoice, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/apInvh/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<ApInvoice>;
    const updated = stores.ap.invoice.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete (Void)
  http.delete(`${API_BASE}/apInvh/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const voided = stores.ap.invoice.void(id, {
      Status: 'Void',
    } as Partial<ApInvoice>);
    
    if (!voided) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Get Next Invoice No
  http.get(`${API_BASE}/apInvh/nextNo`, async () => {
    await delay(100);
    const allInvoices = stores.ap.invoice.getAll();
    const maxNo = allInvoices.reduce((max: number, inv: ApInvoice) => {
      const match = inv.InvNo.match(/INV-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return HttpResponse.json({ InvNo: `INV-${String(maxNo + 1).padStart(4, '0')}` });
  }),
];

// ============================================================================
// AP Payment Handlers
// ============================================================================

export const apPaymentHandlers = [
  // Search/List
  http.post(`${API_BASE}/apPmt/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.ap.payment.search(
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
  http.get(`${API_BASE}/apPmt/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const payment = stores.ap.payment.getById(id);
    
    if (!payment) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(payment);
  }),

  // Create
  http.post(`${API_BASE}/apPmt`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<ApPayment, 'ApPmtSeq'>;
    const newPayment = stores.ap.payment.create(body);
    return HttpResponse.json(newPayment, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/apPmt/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<ApPayment>;
    const updated = stores.ap.payment.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete (Void)
  http.delete(`${API_BASE}/apPmt/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const voided = stores.ap.payment.void(id, {
      Status: 'Void',
    } as Partial<ApPayment>);
    
    if (!voided) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================================================
// AP Vendor Handlers
// ============================================================================

export const apVendorHandlers = [
  // Search/List
  http.post(`${API_BASE}/apVendor/search`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UriQueryString;
    const page = body.Page || 1;
    const limit = body.Limit || 20;
    
    const result = stores.ap.vendor.search(
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

  // Get All Vendors (for lookup)
  http.get(`${API_BASE}/apVendor`, async () => {
    await delay(200);
    const vendors = stores.ap.vendor.getAll();
    return HttpResponse.json(vendors);
  }),

  // Get Detail
  http.get(`${API_BASE}/apVendor/:id`, async ({ params }) => {
    await delay(200);
    const id = parseInt(params.id as string, 10);
    const vendor = stores.ap.vendor.getById(id);
    
    if (!vendor) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(vendor);
  }),

  // Create
  http.post(`${API_BASE}/apVendor`, async ({ request }) => {
    await delay(400);
    const body = await request.json() as ApVendor;
    const newVendor = stores.ap.vendor.create(body);
    return HttpResponse.json(newVendor, { status: 201 });
  }),

  // Update
  http.put(`${API_BASE}/apVendor/:id`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string, 10);
    const body = await request.json() as Partial<ApVendor>;
    const updated = stores.ap.vendor.update(id, body);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete
  http.delete(`${API_BASE}/apVendor/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const deleted = stores.ap.vendor.delete(id);
    
    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Vendor Lookup
  http.get(`${API_BASE}/apVendor/lookup/:search`, async ({ params }) => {
    await delay(150);
    const search = (params.search as string).toLowerCase();
    const vendors = stores.ap.vendor.search((item: ApVendor) =>
      item.VendorCode.toLowerCase().includes(search) ||
      item.VendorName.toLowerCase().includes(search)
    ).data.slice(0, 10);
    
    return HttpResponse.json(vendors);
  }),
];

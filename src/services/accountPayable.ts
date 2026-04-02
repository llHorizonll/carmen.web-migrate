/**
 * Accounts Payable Services
 * Based on original src/services/accountPayable.js
 * Preserves exact API behavior, adds TypeScript types
 * 
 * API Endpoints (per requirements):
 * - /api/apVendor/search
 * - /api/apInvoice/search
 * - /api/apPayment/search
 */

import axiosAuth from '../utils/request';
import type {
  ApVendor,
  ApInvoice,
  ApPayment,
} from '../types/models';
import type {
  ApInvoiceFilterParams,
  ApPaymentFilterParams,
  ApVendorFilterParams,
  PagingResult,
} from '../types/api';

// ============================================================================
// AP Vendor APIs
// ============================================================================

/**
 * POST /api/apVendor/search
 */
export async function getVendorList(
  params: ApVendorFilterParams
): Promise<PagingResult<ApVendor>> {
  const { data } = await axiosAuth.post('/api/apVendor/search', params);
  return data;
}

export async function getVendorDetail(VendorId: number): Promise<ApVendor> {
  const { data } = await axiosAuth.get(`/api/apVendor/${VendorId}`);
  return data;
}

export async function createVendor(
  param: Omit<ApVendor, 'VendorId'>
): Promise<ApVendor> {
  const { data } = await axiosAuth.post('/api/apVendor', param);
  return data;
}

export async function updateVendor(param: ApVendor): Promise<ApVendor> {
  const { data } = await axiosAuth.put(`/api/apVendor/${param.VendorId}`, param);
  return data;
}

export async function deleteVendor(VendorId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/apVendor/${VendorId}`);
  return data;
}

// ============================================================================
// AP Invoice APIs
// ============================================================================

/**
 * POST /api/apInvoice/search
 */
export async function getApInvoiceSearchList(
  params: ApInvoiceFilterParams
): Promise<PagingResult<ApInvoice>> {
  const { data } = await axiosAuth.post('/api/apInvoice/search', params);
  return data;
}

export async function getApInvoiceDetail(ApInvhSeq: number): Promise<ApInvoice> {
  const { data } = await axiosAuth.get(`/api/apInvoice/${ApInvhSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createApInvoice(
  param: Omit<ApInvoice, 'ApInvhSeq'>
): Promise<ApInvoice> {
  const { data } = await axiosAuth.post('/api/apInvoice', param);
  return data;
}

export async function updateApInvoice(param: ApInvoice): Promise<ApInvoice> {
  const { data } = await axiosAuth.put(`/api/apInvoice/${param.ApInvhSeq}`, param);
  return data;
}

export async function deleteApInvoice(
  ApInvhSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/apInvoice/${ApInvhSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

export async function postApInvoice(ApInvhSeq: number): Promise<ApInvoice> {
  const { data } = await axiosAuth.post(`/api/apInvoice/post/${ApInvhSeq}`);
  return data;
}

// ============================================================================
// AP Payment APIs
// ============================================================================

/**
 * POST /api/apPayment/search
 */
export async function getApPaymentSearchList(
  params: ApPaymentFilterParams
): Promise<PagingResult<ApPayment>> {
  const { data } = await axiosAuth.post('/api/apPayment/search', params);
  return data;
}

export async function getApPaymentDetail(ApPmtSeq: number): Promise<ApPayment> {
  const { data } = await axiosAuth.get(`/api/apPayment/${ApPmtSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createApPayment(
  param: Omit<ApPayment, 'ApPmtSeq'>
): Promise<ApPayment> {
  const { data } = await axiosAuth.post('/api/apPayment', param);
  return data;
}

export async function updateApPayment(param: ApPayment): Promise<ApPayment> {
  const { data } = await axiosAuth.put(`/api/apPayment/${param.ApPmtSeq}`, param);
  return data;
}

export async function deleteApPayment(
  ApPmtSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/apPayment/${ApPmtSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

export async function postApPayment(ApPmtSeq: number): Promise<ApPayment> {
  const { data } = await axiosAuth.post(`/api/apPayment/post/${ApPmtSeq}`);
  return data;
}

// ============================================================================
// AP Aging Report APIs
// ============================================================================

export async function getApAgingReport(
  asOfDate: string,
  vendorId?: number
): Promise<unknown[]> {
  const params = new URLSearchParams();
  params.append('asOfDate', asOfDate);
  if (vendorId) {
    params.append('vendorId', vendorId.toString());
  }
  const { data } = await axiosAuth.get(`/api/apAging?${params.toString()}`);
  return data;
}

// ============================================================================
// AP Vendor Balance APIs
// ============================================================================

export async function getVendorBalance(
  vendorId: number
): Promise<{
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  Balance: number;
  CurCode: string;
}> {
  const { data } = await axiosAuth.get(`/api/apVendor/balance/${vendorId}`);
  return data;
}

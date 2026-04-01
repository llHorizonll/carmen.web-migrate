/**
 * Account Payable Services
 * AP module API services
 */

import axiosAuth from '../utils/request';
import type {
  ApInvoice,
  ApPayment,
  ApVendor,
} from '../types/models';
import type {
  ApInvoiceFilterParams,
  ApPaymentFilterParams,
  ApVendorFilterParams,
  PagingResult,
} from '../types/api';

// ============================================================================
// AP Invoice APIs
// ============================================================================

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

export async function createApInvoiceDetail(
  param: Omit<ApInvoice, 'ApInvhSeq'>
): Promise<ApInvoice> {
  const { data } = await axiosAuth.post('/api/apInvoice', param);
  return data;
}

export async function updateApInvoiceDetail(
  param: ApInvoice
): Promise<ApInvoice> {
  const { data } = await axiosAuth.put(`/api/apInvoice/${param.ApInvhSeq}`, param);
  return data;
}

export async function delApInvoiceDetail(
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

// ============================================================================
// AP Payment APIs
// ============================================================================

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

export async function createApPaymentDetail(
  param: Omit<ApPayment, 'ApPmtSeq'>
): Promise<ApPayment> {
  const { data } = await axiosAuth.post('/api/apPayment', param);
  return data;
}

export async function updateApPaymentDetail(
  param: ApPayment
): Promise<ApPayment> {
  const { data } = await axiosAuth.put(`/api/apPayment/${param.ApPmtSeq}`, param);
  return data;
}

export async function delApPaymentDetail(
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

// ============================================================================
// AP Vendor APIs
// ============================================================================

export async function getApVendorSearchList(
  params: ApVendorFilterParams
): Promise<PagingResult<ApVendor>> {
  const { data } = await axiosAuth.post('/api/apVendor/search', params);
  return data;
}

export async function getApVendorDetail(VendorId: number): Promise<ApVendor> {
  const { data } = await axiosAuth.get(`/api/apVendor/${VendorId}`);
  return data;
}

export async function createApVendor(
  param: Omit<ApVendor, 'VendorId'>
): Promise<ApVendor> {
  const { data } = await axiosAuth.post('/api/apVendor', param);
  return data;
}

export async function updateApVendor(param: ApVendor): Promise<ApVendor> {
  const { data } = await axiosAuth.put(`/api/apVendor/${param.VendorId}`, param);
  return data;
}

export async function deleteApVendor(VendorId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/apVendor/${VendorId}`);
  return data;
}

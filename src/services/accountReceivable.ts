/**
 * Accounts Receivable Services
 * Based on original src/services/accountReceivable.js
 * Preserves exact API behavior, adds TypeScript types
 */

import axiosAuth from '../utils/request';
import type {
  ArProfile,
  ArFolio,
  ArInvoice,
  ArReceipt,
} from '../types/models';
import type {
  ArInvoiceFilterParams,
  ArReceiptFilterParams,
  ArProfileFilterParams,
  ArFolioFilterParams,
  UriQueryString,
  PagingResult,
} from '../types/api';

// ============================================================================
// AR Profile APIs
// ============================================================================

export async function getArProfileList(
  params: ArProfileFilterParams
): Promise<PagingResult<ArProfile>> {
  const { data } = await axiosAuth.post('/api/arProfile/search', params);
  return data;
}

export async function getArProfileDetail(ProfileId: number): Promise<ArProfile> {
  const { data } = await axiosAuth.get(`/api/arProfile/${ProfileId}`);
  return data;
}

export async function createArProfile(
  param: Omit<ArProfile, 'ProfileId'>
): Promise<ArProfile> {
  const { data } = await axiosAuth.post('/api/arProfile', param);
  return data;
}

export async function updateArProfile(param: ArProfile): Promise<ArProfile> {
  const { data } = await axiosAuth.put(`/api/arProfile/${param.ProfileId}`, param);
  return data;
}

export async function deleteArProfile(ProfileId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/arProfile/${ProfileId}`);
  return data;
}

// ============================================================================
// AR Folio APIs
// ============================================================================

export async function getArFolioList(
  params: ArFolioFilterParams
): Promise<ArFolio[]> {
  const { data } = await axiosAuth.post('/api/arFolio/search', params);
  return data;
}

export async function getArFolioBalance(
  ProfileId: number
): Promise<{
  ProfileId: number;
  ProfileCode: string;
  ProfileName: string;
  Balance: number;
}> {
  const { data } = await axiosAuth.get(`/api/arFolio/balance/${ProfileId}`);
  return data;
}

// ============================================================================
// AR Invoice APIs
// ============================================================================

export async function getArInvoiceSearchList(
  params: ArInvoiceFilterParams
): Promise<PagingResult<ArInvoice>> {
  const { data } = await axiosAuth.post('/api/arInvoice/search', params);
  return data;
}

export async function getArInvoiceDetail(ArInvhSeq: number): Promise<ArInvoice> {
  const { data } = await axiosAuth.get(`/api/arInvoice/${ArInvhSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createArInvoice(
  param: Omit<ArInvoice, 'ArInvhSeq'>
): Promise<ArInvoice> {
  const { data } = await axiosAuth.post('/api/arInvoice', param);
  return data;
}

export async function updateArInvoice(param: ArInvoice): Promise<ArInvoice> {
  const { data } = await axiosAuth.put(`/api/arInvoice/${param.ArInvhSeq}`, param);
  return data;
}

export async function deleteArInvoice(
  ArInvhSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/arInvoice/${ArInvhSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

export async function postArInvoice(ArInvhSeq: number): Promise<ArInvoice> {
  const { data } = await axiosAuth.post(`/api/arInvoice/post/${ArInvhSeq}`);
  return data;
}

// ============================================================================
// AR Receipt APIs
// ============================================================================

export async function getArReceiptSearchList(
  params: ArReceiptFilterParams
): Promise<PagingResult<ArReceipt>> {
  const { data } = await axiosAuth.post('/api/arReceipt/search', params);
  return data;
}

export async function getArReceiptDetail(ArRcptSeq: number): Promise<ArReceipt> {
  const { data } = await axiosAuth.get(`/api/arReceipt/${ArRcptSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createArReceipt(
  param: Omit<ArReceipt, 'ArRcptSeq'>
): Promise<ArReceipt> {
  const { data } = await axiosAuth.post('/api/arReceipt', param);
  return data;
}

export async function updateArReceipt(param: ArReceipt): Promise<ArReceipt> {
  const { data } = await axiosAuth.put(`/api/arReceipt/${param.ArRcptSeq}`, param);
  return data;
}

export async function deleteArReceipt(
  ArRcptSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/arReceipt/${ArRcptSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

export async function postArReceipt(ArRcptSeq: number): Promise<ArReceipt> {
  const { data } = await axiosAuth.post(`/api/arReceipt/post/${ArRcptSeq}`);
  return data;
}

// ============================================================================
// AR Aging Report APIs
// ============================================================================

export async function getArAgingReport(
  asOfDate: string,
  profileId?: number
): Promise<unknown[]> {
  const params = new URLSearchParams();
  params.append('asOfDate', asOfDate);
  if (profileId) {
    params.append('profileId', profileId.toString());
  }
  const { data } = await axiosAuth.get(`/api/arAging?${params.toString()}`);
  return data;
}

// ============================================================================
// AR Type APIs
// ============================================================================

export async function getArTypeList(): Promise<
  Array<{
    ArTypeId: number;
    ArTypeName: string;
  }>
> {
  const { data } = await axiosAuth.get('/api/arType');
  return data;
}

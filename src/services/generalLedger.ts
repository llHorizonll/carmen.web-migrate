/**
 * General Ledger Services
 * Based on original src/services/generalLedger.js
 * Preserves exact API behavior, adds TypeScript types
 */

import axiosAuth from '../utils/request';
import type {
  JournalVoucher,
  AllocationVoucher,
  AmortizationVoucher,
  StandardVoucher,
  Budget,
  ChartOfAccount,
} from '../types/models';
import type {
  JvFilterParams,
  AllocationJvFilterParams,
  BudgetFilterParams,
  UriQueryString,
  PagingResult,
} from '../types/api';

// ============================================================================
// Journal Voucher APIs
// ============================================================================

export async function getJvSearchList(
  params: JvFilterParams
): Promise<PagingResult<JournalVoucher>> {
  const { data } = await axiosAuth.post('/api/glJv/search', params);
  return data;
}

export async function getJvDetail(JvhSeq: number): Promise<JournalVoucher> {
  const { data } = await axiosAuth.get(`/api/glJv/${JvhSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createJvDetail(
  param: Omit<JournalVoucher, 'JvhSeq'>
): Promise<JournalVoucher> {
  const { data } = await axiosAuth.post('/api/glJv', param);
  return data;
}

export async function updateJvDetail(
  param: JournalVoucher
): Promise<JournalVoucher> {
  const { data } = await axiosAuth.put(`/api/glJv/${param.JvhSeq}`, param);
  return data;
}

export async function delJvDetail(
  JvhSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/glJv/${JvhSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

// ============================================================================
// Allocation Voucher APIs
// ============================================================================

export async function getAllocationJvSearchList(
  params: AllocationJvFilterParams
): Promise<PagingResult<AllocationVoucher>> {
  const { data } = await axiosAuth.post('/api/allocationJv/search', params);
  return data;
}

export async function getAllocationJvDetail(
  AJvhSeq: number
): Promise<AllocationVoucher> {
  const { data } = await axiosAuth.get(`/api/allocationJv/${AJvhSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createAllocationJvDetail(
  param: Omit<AllocationVoucher, 'AJvhSeq'>
): Promise<AllocationVoucher> {
  const { data } = await axiosAuth.post('/api/allocationJv', param);
  return data;
}

export async function updateAllocationJvDetail(
  param: AllocationVoucher
): Promise<AllocationVoucher> {
  const { data } = await axiosAuth.put(
    `/api/allocationJv/${param.AJvhSeq}`,
    param
  );
  return data;
}

export async function delAllocationJvDetail(
  AJvhSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/allocationJv/${AJvhSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

// ============================================================================
// Standard Voucher (Template) APIs
// ============================================================================

export async function getJvFrSearchList(
  params: UriQueryString
): Promise<PagingResult<StandardVoucher>> {
  const { data } = await axiosAuth.post('/api/glJvFr/search', params);
  return data;
}

export async function getJvFrDetail(FJvhSeq: number): Promise<StandardVoucher> {
  const { data } = await axiosAuth.get(`/api/glJvFr/${FJvhSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createJvFrDetail(
  param: Omit<StandardVoucher, 'FJvhSeq'>
): Promise<StandardVoucher> {
  const { data } = await axiosAuth.post('/api/glJvFr', param);
  return data;
}

export async function updateJvFrDetail(
  param: StandardVoucher
): Promise<StandardVoucher> {
  const { data } = await axiosAuth.put(`/api/glJvFr/${param.FJvhSeq}`, param);
  return data;
}

export async function delJvFrDetail(FJvhSeq: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/glJvFr/${FJvhSeq}`);
  return data;
}

// ============================================================================
// Amortization Voucher APIs
// ============================================================================

export async function getAmortizeJvSearchList(
  params: UriQueryString
): Promise<PagingResult<AmortizationVoucher>> {
  const { data } = await axiosAuth.post('/api/amortizeStdJv/search', params);
  return data;
}

export async function getAmortizeHistory(
  Id: number
): Promise<unknown[]> {
  const { data } = await axiosAuth.get(`/api/amortizeHistory/${Id}`);
  return data;
}

export async function getAmortizeStdJvDetail(
  FJvhSeq: number
): Promise<AmortizationVoucher> {
  const { data } = await axiosAuth.get(`/api/amortizeStdJv/${FJvhSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createAmortizeStdJvDetail(
  param: Omit<AmortizationVoucher, 'FJvhSeq'>
): Promise<AmortizationVoucher> {
  const { data } = await axiosAuth.post('/api/amortizeStdJv', param);
  return data;
}

export async function updateAmortizeStdJvDetail(
  param: AmortizationVoucher
): Promise<AmortizationVoucher> {
  const { data } = await axiosAuth.put(
    `/api/amortizeStdJv/${param.FJvhSeq}`,
    param
  );
  return data;
}

export async function delAmortizeStdJvDetail(FJvhSeq: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/amortizeStdJv/${FJvhSeq}`);
  return data;
}

// ============================================================================
// Chart of Account APIs
// ============================================================================

export async function getChartOfAccountList(): Promise<ChartOfAccount[]> {
  const { data } = await axiosAuth.get('/api/accountCode');
  return data;
}

export async function getChartOfAccountDetail(
  AccId: number
): Promise<ChartOfAccount> {
  const { data } = await axiosAuth.get(`/api/accountCode/${AccId}`);
  return data;
}

// ============================================================================
// Budget APIs
// ============================================================================

export async function getBudgetList(
  params: BudgetFilterParams
): Promise<PagingResult<Budget>> {
  const { data } = await axiosAuth.post('/api/budget/search', params);
  return data;
}

export async function getBudgetDetail(BudgetId: number): Promise<Budget> {
  const { data } = await axiosAuth.get(`/api/budget/${BudgetId}`);
  return data;
}

export async function createBudget(
  param: Omit<Budget, 'BudgetId'>
): Promise<Budget> {
  const { data } = await axiosAuth.post('/api/budget', param);
  return data;
}

export async function updateBudget(param: Budget): Promise<Budget> {
  const { data } = await axiosAuth.put(`/api/budget/${param.BudgetId}`, param);
  return data;
}

export async function deleteBudget(BudgetId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/budget/${BudgetId}`);
  return data;
}

// ============================================================================
// GL Prefix APIs
// ============================================================================

export async function getGlPrefix(): Promise<
  Array<{
    Prefix: string;
    PrefixName: string;
  }>
> {
  const { data } = await axiosAuth.get('/api/glPrefix');
  return data;
}

export async function getGlPrefixSearchList(
  params: UriQueryString
): Promise<PagingResult<unknown>> {
  const { data } = await axiosAuth.post('/api/glPrefix/search', params);
  return data;
}

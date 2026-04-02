/**
 * General Ledger Services
 * Based on original src/services/generalLedger.js
 * Preserves exact API behavior, adds TypeScript types
 * 
 * API Endpoints (per requirements):
 * - /api/glJv/search (GET/POST)
 * - /api/glJv/create (POST)
 * - /api/glAllocationJv/search
 * - /api/glStdJv/search
 * - /api/glRecurringStdJv/search
 * - /api/glAmortizationStdJv/search
 * - /api/glAccountSummary
 * - /api/glFinancialReport
 * - /api/glChartOfAccounts
 * - /api/glBudget/search
 */

import axiosAuth from '../utils/request';
import type {
  JournalVoucher,
  AllocationVoucher,
  AmortizationVoucher,
  StandardVoucher,
  RecurringVoucher,
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

/**
 * GET /api/glJv/search
 */
export async function getJvSearchList(
  params: JvFilterParams
): Promise<PagingResult<JournalVoucher>> {
  const { data } = await axiosAuth.get('/api/glJv/search', { params });
  return data;
}

/**
 * POST /api/glJv/search
 */
export async function postJvSearchList(
  params: JvFilterParams
): Promise<PagingResult<JournalVoucher>> {
  const { data } = await axiosAuth.post('/api/glJv/search', params);
  return data;
}

/**
 * POST /api/glJv/create
 */
export async function createJv(
  param: Omit<JournalVoucher, 'JvhSeq'>
): Promise<JournalVoucher> {
  const { data } = await axiosAuth.post('/api/glJv/create', param);
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

/**
 * POST /api/glAllocationJv/search
 */
export async function getAllocationJvSearchList(
  params: AllocationJvFilterParams
): Promise<PagingResult<AllocationVoucher>> {
  const { data } = await axiosAuth.post('/api/glAllocationJv/search', params);
  return data;
}

export async function getAllocationJvDetail(
  AJvhSeq: number
): Promise<AllocationVoucher> {
  const { data } = await axiosAuth.get(`/api/glAllocationJv/${AJvhSeq}`);
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
  const { data } = await axiosAuth.post('/api/glAllocationJv', param);
  return data;
}

export async function updateAllocationJvDetail(
  param: AllocationVoucher
): Promise<AllocationVoucher> {
  const { data } = await axiosAuth.put(
    `/api/glAllocationJv/${param.AJvhSeq}`,
    param
  );
  return data;
}

export async function postAllocationJvDetail(AJvhSeq: number): Promise<AllocationVoucher> {
  const { data } = await axiosAuth.post(`/api/glAllocationJv/post/${AJvhSeq}`);
  return data;
}

export async function delAllocationJvDetail(
  AJvhSeq: number,
  username: string,
  remark: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/glAllocationJv/${AJvhSeq}?user=${username}&voidRemark=${encodeURIComponent(
      remark
    )}`
  );
  return data;
}

// ============================================================================
// Standard Voucher (Template) APIs
// ============================================================================

/**
 * POST /api/glStdJv/search
 */
export async function getJvFrSearchList(
  params: UriQueryString
): Promise<PagingResult<StandardVoucher>> {
  const { data } = await axiosAuth.post('/api/glStdJv/search', params);
  return data;
}

export async function getJvFrDetail(FJvhSeq: number): Promise<StandardVoucher> {
  const { data } = await axiosAuth.get(`/api/glStdJv/${FJvhSeq}`);
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
  const { data } = await axiosAuth.post('/api/glStdJv', param);
  return data;
}

export async function updateJvFrDetail(
  param: StandardVoucher
): Promise<StandardVoucher> {
  const { data } = await axiosAuth.put(`/api/glStdJv/${param.FJvhSeq}`, param);
  return data;
}

export async function delJvFrDetail(FJvhSeq: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/glStdJv/${FJvhSeq}`);
  return data;
}

// ============================================================================
// Recurring Voucher APIs
// ============================================================================

/**
 * POST /api/glRecurringStdJv/search
 */
export async function getRecurringStdJvSearchList(
  params: UriQueryString
): Promise<PagingResult<RecurringVoucher>> {
  const { data } = await axiosAuth.post('/api/glRecurringStdJv/search', params);
  return data;
}

export async function getRecurringStdJvDetail(
  RecSeq: number
): Promise<RecurringVoucher> {
  const { data } = await axiosAuth.get(`/api/glRecurringStdJv/${RecSeq}`);
  if (data?.Detail?.length > 0) {
    data.Detail.forEach((item: { index?: number }, idx: number) => {
      item.index = idx;
    });
  }
  return data;
}

export async function createRecurringStdJvDetail(
  param: Omit<RecurringVoucher, 'RecSeq'>
): Promise<RecurringVoucher> {
  const { data } = await axiosAuth.post('/api/glRecurringStdJv', param);
  return data;
}

export async function updateRecurringStdJvDetail(
  param: RecurringVoucher
): Promise<RecurringVoucher> {
  const { data } = await axiosAuth.put(
    `/api/glRecurringStdJv/${param.RecSeq}`,
    param
  );
  return data;
}

export async function delRecurringStdJvDetail(RecSeq: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/glRecurringStdJv/${RecSeq}`);
  return data;
}

// ============================================================================
// Amortization Voucher APIs
// ============================================================================

/**
 * POST /api/glAmortizationStdJv/search
 */
export async function getAmortizeJvSearchList(
  params: UriQueryString
): Promise<PagingResult<AmortizationVoucher>> {
  const { data } = await axiosAuth.post('/api/glAmortizationStdJv/search', params);
  return data;
}

export async function getAmortizeHistory(
  Id: number
): Promise<unknown[]> {
  const { data } = await axiosAuth.get(`/api/glAmortizationHistory/${Id}`);
  return data;
}

export async function getAmortizeStdJvDetail(
  FJvhSeq: number
): Promise<AmortizationVoucher> {
  const { data } = await axiosAuth.get(`/api/glAmortizationStdJv/${FJvhSeq}`);
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
  const { data } = await axiosAuth.post('/api/glAmortizationStdJv', param);
  return data;
}

export async function updateAmortizeStdJvDetail(
  param: AmortizationVoucher
): Promise<AmortizationVoucher> {
  const { data } = await axiosAuth.put(
    `/api/glAmortizationStdJv/${param.FJvhSeq}`,
    param
  );
  return data;
}

export async function delAmortizeStdJvDetail(FJvhSeq: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/glAmortizationStdJv/${FJvhSeq}`);
  return data;
}

// ============================================================================
// Chart of Account APIs
// ============================================================================

/**
 * GET /api/glChartOfAccounts
 */
export async function getChartOfAccountList(): Promise<ChartOfAccount[]> {
  const { data } = await axiosAuth.get('/api/glChartOfAccounts');
  return data;
}

export async function getChartOfAccountDetail(
  AccId: number
): Promise<ChartOfAccount> {
  const { data } = await axiosAuth.get(`/api/glChartOfAccounts/${AccId}`);
  return data;
}

// ============================================================================
// Budget APIs
// ============================================================================

/**
 * POST /api/glBudget/search
 */
export async function getBudgetList(
  params: BudgetFilterParams
): Promise<PagingResult<Budget>> {
  const { data } = await axiosAuth.post('/api/glBudget/search', params);
  return data;
}

export async function getBudgetDetail(BudgetId: number): Promise<Budget> {
  const { data } = await axiosAuth.get(`/api/glBudget/${BudgetId}`);
  return data;
}

export async function createBudget(
  param: Omit<Budget, 'BudgetId'>
): Promise<Budget> {
  const { data } = await axiosAuth.post('/api/glBudget', param);
  return data;
}

export async function updateBudget(param: Budget): Promise<Budget> {
  const { data } = await axiosAuth.put(`/api/glBudget/${param.BudgetId}`, param);
  return data;
}

export async function deleteBudget(BudgetId: number): Promise<void> {
  const { data } = await axiosAuth.delete(`/api/glBudget/${BudgetId}`);
  return data;
}

// ============================================================================
// GL Reports & Summary APIs
// ============================================================================

/**
 * GET /api/glAccountSummary
 */
export async function getGlAccountSummary(
  params?: {
    accCode?: string;
    deptCode?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<unknown[]> {
  const { data } = await axiosAuth.get('/api/glAccountSummary', { params });
  return data;
}

/**
 * POST /api/glAccountSummary
 */
export async function postGlAccountSummary(
  params?: {
    accCode?: string;
    deptCode?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<unknown[]> {
  const { data } = await axiosAuth.post('/api/glAccountSummary', params);
  return data;
}

/**
 * GET /api/glFinancialReport
 */
export async function getGlFinancialReport(
  reportType: 'balanceSheet' | 'incomeStatement' | 'trialBalance',
  asOfDate?: string,
  fromDate?: string,
  toDate?: string
): Promise<unknown> {
  const params = new URLSearchParams();
  params.append('reportType', reportType);
  if (asOfDate) params.append('asOfDate', asOfDate);
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  const { data } = await axiosAuth.get(`/api/glFinancialReport?${params.toString()}`);
  return data;
}

/**
 * POST /api/glFinancialReport
 */
export async function postGlFinancialReport(
  reportType: 'balanceSheet' | 'incomeStatement' | 'trialBalance',
  asOfDate?: string,
  fromDate?: string,
  toDate?: string
): Promise<unknown> {
  const { data } = await axiosAuth.post('/api/glFinancialReport', {
    reportType,
    asOfDate,
    fromDate,
    toDate,
  });
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

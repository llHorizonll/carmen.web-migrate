/**
 * GL Module Mock Data
 * Journal Vouchers, Allocation Vouchers, Standard Vouchers, Amortization Vouchers
 */

import type { 
  JournalVoucher, 
  JournalVoucherDetail,
  AllocationVoucher,
  AllocationVoucherDetail,
  StandardVoucher,
  StandardVoucherDetail,
  AmortizationVoucher,
  ChartOfAccount,
  Budget
} from '../../types';

// Helper to generate dates
const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Helper to generate voucher number
const generateVoucherNo = (prefix: string, seq: number): string => {
  return `${prefix}-2024-${String(seq).padStart(4, '0')}`;
};

// Journal Voucher Mock Data
export const generateJournalVouchers = (count = 50): JournalVoucher[] => {
  const vouchers: JournalVoucher[] = [];
  const prefixes = ['JV', 'AJ', 'SJ', 'RJ'];
  const descriptions = [
    'Monthly rent allocation',
    'Utility expenses',
    'Office supplies purchase',
    'Salary allocation',
    'Insurance payment',
    'Depreciation expense',
    'Interest expense',
    'Marketing expenses',
    'Travel expenses',
    'Maintenance costs',
  ];

  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const status = i % 10 === 0 ? 'Void' : i % 5 === 0 ? 'Draft' : 'Normal';
    const detailCount = Math.floor(Math.random() * 3) + 2;
    const details: JournalVoucherDetail[] = [];
    
    let totalDr = 0;
    for (let d = 0; d < detailCount; d++) {
      const amount = Math.round(Math.random() * 100000) + 1000;
      totalDr += amount;
      details.push({
        index: d,
        JvdSeq: i * 100 + d,
        JvhSeq: i,
        DeptCode: ['HQ', 'SALES', 'IT', 'HR'][d % 4],
        AccCode: ['6100', '6200', '6300', '6400'][d % 4],
        Description: descriptions[d % descriptions.length],
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: d === detailCount - 1 ? 0 : amount,
        DrBase: d === detailCount - 1 ? 0 : amount,
        CrAmount: d === detailCount - 1 ? totalDr : 0,
        CrBase: d === detailCount - 1 ? totalDr : 0,
        IsOverWrite: true,
        DimList: { Dim: [] },
      });
    }

    vouchers.push({
      JvhSeq: i,
      JvhDate: generateDate(i * 2),
      Prefix: prefix,
      JvhNo: generateVoucherNo(prefix, i),
      JvhSource: 'GL',
      Status: status as 'Draft' | 'Normal' | 'Void',
      Description: descriptions[i % descriptions.length],
      Detail: details,
      DimHList: { Dim: [] },
      UserModified: 'admin',
      DateModified: generateDate(i),
    });
  }

  return vouchers;
};

// Allocation Voucher Mock Data
export const generateAllocationVouchers = (count = 30): AllocationVoucher[] => {
  const vouchers: AllocationVoucher[] = [];
  
  for (let i = 1; i <= count; i++) {
    const details: AllocationVoucherDetail[] = [
      {
        index: 0,
        AJvdSeq: i * 100,
        AJvhSeq: i,
        DeptCode: 'HQ',
        AccCode: '6100',
        Description: 'Source - Rent expense',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 50000,
        DrBase: 50000,
        CrAmount: 0,
        CrBase: 0,
        DimList: { Dim: [] },
      },
      {
        index: 1,
        AJvdSeq: i * 100 + 1,
        AJvhSeq: i,
        DeptCode: 'SALES',
        AccCode: '6101',
        Description: 'Allocation - Sales dept',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 0,
        DrBase: 0,
        CrAmount: 30000,
        CrBase: 30000,
        DimList: { Dim: [] },
      },
      {
        index: 2,
        AJvdSeq: i * 100 + 2,
        AJvhSeq: i,
        DeptCode: 'IT',
        AccCode: '6102',
        Description: 'Allocation - IT dept',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 0,
        DrBase: 0,
        CrAmount: 20000,
        CrBase: 20000,
        DimList: { Dim: [] },
      },
    ];

    vouchers.push({
      AJvhSeq: i,
      AJvhDate: generateDate(i * 3),
      Prefix: 'AL',
      AJvhNo: generateVoucherNo('AL', i),
      Status: i % 8 === 0 ? 'Void' : i % 4 === 0 ? 'Draft' : 'Normal',
      Description: `Allocation - Monthly expense distribution ${i}`,
      SourceJvId: i,
      Detail: details,
      DimHList: { Dim: [] },
      UserModified: 'admin',
    });
  }

  return vouchers;
};

// Standard Voucher (Template) Mock Data
export const generateStandardVouchers = (count = 20): StandardVoucher[] => {
  const vouchers: StandardVoucher[] = [];
  const templates = [
    { name: 'Monthly Rent', acc: '6100', amt: 50000 },
    { name: 'Salary Accrual', acc: '6200', amt: 150000 },
    { name: 'Utilities', acc: '6300', amt: 15000 },
    { name: 'Insurance', acc: '6400', amt: 25000 },
    { name: 'Depreciation', acc: '6500', amt: 30000 },
  ];

  for (let i = 1; i <= count; i++) {
    const tmpl = templates[i % templates.length];
    const details: StandardVoucherDetail[] = [
      {
        index: 0,
        FJvdSeq: i * 100,
        FJvhSeq: i,
        DeptCode: 'HQ',
        AccCode: tmpl.acc,
        Description: tmpl.name,
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: tmpl.amt,
        DrBase: tmpl.amt,
        CrAmount: 0,
        CrBase: 0,
        DimList: { Dim: [] },
      },
      {
        index: 1,
        FJvdSeq: i * 100 + 1,
        FJvhSeq: i,
        DeptCode: 'HQ',
        AccCode: '2100',
        Description: `Accrual - ${tmpl.name}`,
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 0,
        DrBase: 0,
        CrAmount: tmpl.amt,
        CrBase: tmpl.amt,
        DimList: { Dim: [] },
      },
    ];

    vouchers.push({
      FJvhSeq: i,
      FJvhDate: generateDate(0),
      Prefix: 'TP',
      FJvhNo: generateVoucherNo('TP', i),
      Description: `Template - ${tmpl.name}`,
      Detail: details,
      DimHList: { Dim: [] },
      UserModified: 'admin',
    });
  }

  return vouchers;
};

// Amortization Voucher Mock Data
export const generateAmortizationVouchers = (count = 15): AmortizationVoucher[] => {
  const vouchers: AmortizationVoucher[] = [];

  for (let i = 1; i <= count; i++) {
    const totalPeriod = 12;
    const currentPeriod = Math.floor(Math.random() * 8) + 1;
    const amount = 120000;
    const monthlyAmt = amount / totalPeriod;

    const details: StandardVoucherDetail[] = [
      {
        index: 0,
        FJvdSeq: i * 100,
        FJvhSeq: i,
        DeptCode: 'HQ',
        AccCode: '6500',
        Description: 'Amortization expense',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: monthlyAmt,
        DrBase: monthlyAmt,
        CrAmount: 0,
        CrBase: 0,
        DimList: { Dim: [] },
      },
      {
        index: 1,
        FJvdSeq: i * 100 + 1,
        FJvhSeq: i,
        DeptCode: 'HQ',
        AccCode: '1900',
        Description: 'Prepaid amortization',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 0,
        DrBase: 0,
        CrAmount: monthlyAmt,
        CrBase: monthlyAmt,
        DimList: { Dim: [] },
      },
    ];

    vouchers.push({
      FJvhSeq: i,
      FJvhDate: generateDate(i * 5),
      Prefix: 'AM',
      FJvhNo: generateVoucherNo('AM', i),
      Description: `Amortization - License fee ${i}`,
      Detail: details,
      DimHList: { Dim: [] },
      UserModified: 'admin',
      AmortizeType: 'Straight Line',
      StartDate: generateDate(365),
      EndDate: generateDate(0),
      TotalPeriod: totalPeriod,
      CurrentPeriod: currentPeriod,
      Amount: amount,
    });
  }

  return vouchers;
};

// Chart of Accounts Mock Data
export const generateChartOfAccounts = (): ChartOfAccount[] => {
  const accounts: ChartOfAccount[] = [
    { AccId: 1, AccCode: '1000', AccName: 'Cash', AccType: 'Asset', Level: 1, IsActive: true, IsPostable: false },
    { AccId: 2, AccCode: '1100', AccName: 'Bank', AccType: 'Asset', Level: 1, IsActive: true, IsPostable: false },
    { AccId: 3, AccCode: '1200', AccName: 'Accounts Receivable', AccType: 'Asset', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 4, AccCode: '1900', AccName: 'Prepaid Expenses', AccType: 'Asset', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 5, AccCode: '2000', AccName: 'Accounts Payable', AccType: 'Liability', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 6, AccCode: '2100', AccName: 'Accrued Expenses', AccType: 'Liability', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 7, AccCode: '3000', AccName: 'Share Capital', AccType: 'Equity', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 8, AccCode: '3100', AccName: 'Retained Earnings', AccType: 'Equity', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 9, AccCode: '4000', AccName: 'Sales Revenue', AccType: 'Revenue', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 10, AccCode: '5000', AccName: 'Cost of Sales', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 11, AccCode: '6100', AccName: 'Rent Expense', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 12, AccCode: '6200', AccName: 'Salary Expense', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 13, AccCode: '6300', AccName: 'Utility Expense', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 14, AccCode: '6400', AccName: 'Insurance Expense', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: true },
    { AccId: 15, AccCode: '6500', AccName: 'Depreciation Expense', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: true },
  ];

  return accounts;
};

// Budget Mock Data
export const generateBudgets = (count = 20): Budget[] => {
  const budgets: Budget[] = [];
  const accounts = ['6100', '6200', '6300', '6400', '6500'];
  const depts = ['HQ', 'SALES', 'IT', 'HR'];

  for (let i = 1; i <= count; i++) {
    const baseAmount = Math.round(Math.random() * 50000) + 10000;
    budgets.push({
      BudgetId: i,
      BudgetYear: 2024,
      AccCode: accounts[i % accounts.length],
      DeptCode: depts[i % depts.length],
      Period1: baseAmount,
      Period2: baseAmount,
      Period3: baseAmount,
      Period4: baseAmount,
      Period5: baseAmount,
      Period6: baseAmount,
      Period7: baseAmount,
      Period8: baseAmount,
      Period9: baseAmount,
      Period10: baseAmount,
      Period11: baseAmount,
      Period12: baseAmount,
      Total: baseAmount * 12,
    });
  }

  return budgets;
};

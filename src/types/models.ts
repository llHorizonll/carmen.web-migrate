/**
 * Carmen.Web Domain Models
 * Based on original JavaScript models, converted to TypeScript
 */

// ============================================================================
// Common Types
// ============================================================================

export type Status = 'Draft' | 'Normal' | 'Void';
export type Language = 'en-US' | 'th-TH' | 'vi-VN';

export interface Dimension {
  DimCode: string;
  DimName: string;
  Value?: string;
}

export interface DimensionList {
  Dim: Dimension[];
}

export interface ApiResponse<T> {
  Data: T;
  Status: number;
  Message?: string;
}

// ============================================================================
// General Ledger (GL) Models
// ============================================================================

export interface JournalVoucher {
  JvhSeq: number;
  JvhDate: string;
  Prefix: string;
  JvhNo: string;
  JvhSource: string;
  Status: Status;
  Description: string;
  Detail: JournalVoucherDetail[];
  DimHList: DimensionList;
  UserModified: string;
  DateModified?: string;
}

export interface JournalVoucherDetail {
  index?: number;
  JvdSeq: number;
  JvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  DrAmount: number;
  DrBase: number;
  CrAmount: number;
  CrBase: number;
  IsOverWrite: boolean;
  DimList: DimensionList;
}

export interface AllocationVoucher {
  AJvhSeq: number;
  AJvhDate: string;
  Prefix: string;
  AJvhNo: string;
  Status: Status;
  Description: string;
  SourceJvId: number;
  Detail: AllocationVoucherDetail[];
  DimHList: DimensionList;
  UserModified: string;
}

export interface AllocationVoucherDetail {
  index?: number;
  AJvdSeq: number;
  AJvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  DrAmount: number;
  DrBase: number;
  CrAmount: number;
  CrBase: number;
  DimList: DimensionList;
}

export interface StandardVoucher {
  FJvhSeq: number;
  FJvhDate: string;
  Prefix: string;
  FJvhNo: string;
  Description: string;
  Detail: StandardVoucherDetail[];
  DimHList: DimensionList;
  UserModified: string;
}

export interface StandardVoucherDetail {
  index?: number;
  FJvdSeq: number;
  FJvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  DrAmount: number;
  DrBase: number;
  CrAmount: number;
  CrBase: number;
  DimList: DimensionList;
}

export interface RecurringVoucher extends StandardVoucher {
  RecSeq: number;
  RecurringType: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  StartDate: string;
  EndDate?: string;
  LastRunDate?: string;
  NextRunDate?: string;
}

export interface AmortizationVoucher extends StandardVoucher {
  AmortizeType: string;
  StartDate: string;
  EndDate: string;
  TotalPeriod: number;
  CurrentPeriod: number;
  Amount: number;
}

export interface ChartOfAccount {
  AccId: number;
  AccCode: string;
  AccName: string;
  AccType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  ParentId?: number;
  Level: number;
  IsActive: boolean;
  IsPostable: boolean;
}

export interface Budget {
  BudgetId: number;
  BudgetYear: number;
  AccCode: string;
  DeptCode: string;
  Period1: number;
  Period2: number;
  Period3: number;
  Period4: number;
  Period5: number;
  Period6: number;
  Period7: number;
  Period8: number;
  Period9: number;
  Period10: number;
  Period11: number;
  Period12: number;
  Total: number;
}

// ============================================================================
// Accounts Payable (AP) Models
// ============================================================================

export interface ApVendor {
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  Address?: string;
  TaxId?: string;
  ContactPerson?: string;
  Phone?: string;
  Email?: string;
  PaymentTerms?: string;
  CurCode: string;
  IsActive: boolean;
}

export interface ApInvoice {
  ApInvhSeq: number;
  InvNo: string;
  InvDate: string;
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  InvAmount: number;
  InvAmountBase: number;
  VatAmount: number;
  WhtAmount: number;
  NetAmount: number;
  Status: Status;
  Detail: ApInvoiceDetail[];
  UserModified: string;
}

export interface ApInvoiceDetail {
  index?: number;
  ApInvdSeq: number;
  ApInvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  Amount: number;
  AmountBase: number;
  VatCode?: string;
  VatAmount: number;
  WhtCode?: string;
  WhtAmount: number;
  NetAmount: number;
}

export interface ApPayment {
  ApPmtSeq: number;
  PmtNo: string;
  PmtDate: string;
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  PmtAmount: number;
  PmtAmountBase: number;
  BankCode?: string;
  ChqNo?: string;
  ChqDate?: string;
  Status: Status;
  Detail: ApPaymentDetail[];
  UserModified: string;
}

export interface ApPaymentDetail {
  index?: number;
  ApPmtdSeq: number;
  ApPmtSeq: number;
  ApInvhSeq: number;
  InvNo: string;
  InvAmount: number;
  InvBalance: number;
  PmtAmount: number;
}

// ============================================================================
// Accounts Receivable (AR) Models
// ============================================================================

export interface ArProfile {
  ProfileId: number;
  ProfileCode: string;
  ProfileName: string;
  ArTypeId: number;
  ArTypeName?: string;
  TitleId?: number;
  TitleName?: string;
  OwnerId?: number;
  OwnerName?: string;
  ProjectId?: number;
  ProjectName?: string;
  Address?: string;
  TaxId?: string;
  ContactPerson?: string;
  Phone?: string;
  Email?: string;
  CreditLimit?: number;
  CurCode?: string;
  IsActive: boolean;
}

export interface ArFolio {
  FolioId: number;
  ProfileId: number;
  ProfileCode: string;
  ProfileName: string;
  TransDate: string;
  TransType: string;
  TransNo: string;
  Description: string;
  Debit: number;
  Credit: number;
  Balance: number;
}

export interface ArInvoice {
  ArInvhSeq: number;
  InvNo: string;
  InvDate: string;
  ProfileId: number;
  ProfileCode: string;
  ProfileName: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  InvAmount: number;
  InvAmountBase: number;
  VatAmount: number;
  NetAmount: number;
  Status: Status;
  Detail: ArInvoiceDetail[];
  UserModified: string;
}

export interface ArInvoiceDetail {
  index?: number;
  ArInvdSeq: number;
  ArInvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  Amount: number;
  AmountBase: number;
  VatCode?: string;
  VatAmount: number;
}

export interface ArReceipt {
  ArRcptSeq: number;
  RcptNo: string;
  RcptDate: string;
  ProfileId: number;
  ProfileCode: string;
  ProfileName: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  RcptAmount: number;
  RcptAmountBase: number;
  BankCode?: string;
  ChqNo?: string;
  ChqDate?: string;
  Status: Status;
  Detail: ArReceiptDetail[];
  UserModified: string;
}

export interface ArReceiptDetail {
  index?: number;
  ArRcptdSeq: number;
  ArRcptSeq: number;
  ArInvhSeq: number;
  InvNo: string;
  InvAmount: number;
  InvBalance: number;
  RcptAmount: number;
}

// ============================================================================
// Asset Management Models
// ============================================================================

export interface AssetRegister {
  AssetId: number;
  AssetCode: string;
  AssetName: string;
  CategoryId: number;
  CategoryName: string;
  DepartmentId: number;
  DepartmentName: string;
  LocationId?: number;
  LocationName?: string;
  VendorId?: number;
  VendorName?: string;
  PurchaseDate: string;
  PurchasePrice: number;
  CurCode: string;
  DepreciationMethod: string;
  UsefulLife: number;
  SalvageValue: number;
  AccumulatedDepreciation: number;
  NetBookValue: number;
  Status: 'Active' | 'Disposed' | 'Impaired';
}

// ============================================================================
// User & System Models
// ============================================================================

export interface User {
  UserId: number;
  UserName: string;
  FullName: string;
  Email: string;
  IsActive: boolean;
  Permissions: string[];
  DefaultLanguage: Language;
}

export interface Company {
  CompanyId: number;
  CompanyCode: string;
  CompanyName: string;
  Address?: string;
  Phone?: string;
  Email?: string;
  TaxId?: string;
  CurCode: string;
  FiscalYearStart: number;
}

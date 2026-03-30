/**
 * API Types for Carmen.Web
 * Request/Response types and filter parameters
 */

// ============================================================================
// Common API Types
// ============================================================================

export interface UriQueryString {
  Limit: number;
  Page: number;
  OrderBy?: string;
  WhereGroupList?: WhereGroup[];
  Exclude?: unknown;
  WhereRaw?: string;
  WhereLike?: string;
  WhereLikeFields?: string;
}

export interface WhereGroup {
  AndOr: 'And' | 'Or';
  ConditionList: Condition[];
}

export interface Condition {
  AndOr: 'And' | 'Or';
  Field: string;
  Operator: string;
  Value: unknown;
}

export interface PagingResult<T> {
  Data: T[];
  Total: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
}

export interface ApiError {
  Code: number;
  Message: string;
  UserMessage?: string;
  Details?: string;
}

// ============================================================================
// GL API Types
// ============================================================================

export interface JvFilterParams extends UriQueryString {
  Status?: 'Draft' | 'Normal' | 'Void' | 'All';
  Prefix?: string;
  FromDate?: string;
  ToDate?: string;
  Mode?: 'Open Period' | 'Period Date' | 'All';
}

export interface AllocationJvFilterParams extends UriQueryString {
  Status?: 'Draft' | 'Normal' | 'Void' | 'All';
  FromDate?: string;
  ToDate?: string;
}

export interface BudgetFilterParams extends UriQueryString {
  BudgetYear?: number;
  AccCode?: string;
}

// ============================================================================
// AP API Types
// ============================================================================

export interface ApInvoiceFilterParams extends UriQueryString {
  VendorId?: number;
  Status?: 'Draft' | 'Normal' | 'Void' | 'All';
  FromDate?: string;
  ToDate?: string;
  InvNo?: string;
}

export interface ApPaymentFilterParams extends UriQueryString {
  VendorId?: number;
  Status?: 'Draft' | 'Normal' | 'Void' | 'All';
  FromDate?: string;
  ToDate?: string;
  PmtNo?: string;
}

export interface ApVendorFilterParams extends UriQueryString {
  IsActive?: boolean;
  Search?: string;
}

// ============================================================================
// AR API Types
// ============================================================================

export interface ArInvoiceFilterParams extends UriQueryString {
  ProfileId?: number;
  Status?: 'Draft' | 'Normal' | 'Void' | 'All';
  FromDate?: string;
  ToDate?: string;
  InvNo?: string;
}

export interface ArReceiptFilterParams extends UriQueryString {
  ProfileId?: number;
  Status?: 'Draft' | 'Normal' | 'Void' | 'All';
  FromDate?: string;
  ToDate?: string;
  RcptNo?: string;
}

export interface ArProfileFilterParams extends UriQueryString {
  ArTypeId?: number;
  IsActive?: boolean;
  Search?: string;
}

export interface ArFolioFilterParams {
  ProfileId: number;
  FromDate?: string;
  ToDate?: string;
}

// ============================================================================
// Asset API Types
// ============================================================================

export interface AssetFilterParams extends UriQueryString {
  CategoryId?: number;
  DepartmentId?: number;
  Status?: string;
  Search?: string;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
  Username: string;
  Password: string;
  CompanyCode?: string;
}

export interface LoginResponse {
  AccessToken: string;
  RefreshToken: string;
  ExpiresIn: number;
  User: {
    UserId: number;
    UserName: string;
    FullName: string;
    Email: string;
    Permissions: string[];
  };
}

export interface RefreshTokenRequest {
  RefreshToken: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface SystemSetting {
  SettingKey: string;
  SettingValue: string;
  Description?: string;
}

export interface ClosePeriod {
  ClosePeriodGl: string;
  ClosePeriodAp: string;
  ClosePeriodAr: string;
  ClosePeriodAsset: string;
}

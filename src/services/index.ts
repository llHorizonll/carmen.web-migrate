/**
 * Services Index
 * Export all API services
 */

// ============================================================================
// Carmen API Services (New - Using https://dev.carmen4.com/Carmen.api)
// ============================================================================

// Core authentication
export {
  carmenLogin,
  carmenLogout,
  carmenAxios,
  getAccessToken,
  getRefreshToken,
  getCurrentUser,
  getStoredUser,
  isAuthenticated,
  isTokenExpired,
  decodeToken,
  setAccessToken,
  clearAuth,
  carmenConfig,
  type CarmenLoginRequest,
  type CarmenLoginResponse,
  type CarmenUser,
  type JwtPayload,
} from './carmenAuth';

// Carmen User Service
export {
  getCarmenUserList,
  getCarmenUserDetail,
  getCarmenCurrentUser,
  createCarmenUser,
  updateCarmenUser,
  deleteCarmenUser,
  changeCarmenPassword,
  type CarmenUserResponse,
  type CarmenUserListParams,
  type ChangePasswordRequest,
} from './carmenUser';

// Carmen Generic API Service
export {
  createCarmenService,
  carmenCompanyService,
  carmenDepartmentService,
  carmenAccountService,
  carmenCurrencyService,
  type CarmenApiOptions,
  type CarmenSearchParams,
  type CarmenCompany,
  type CarmenDepartment,
  type CarmenAccount,
  type CarmenCurrency,
} from './carmenApi';

// ============================================================================
// Legacy Services (Using window.config API)
// ============================================================================

export * from './user';
export * from './accountPayable';
export * from './accountReceivable';
export * from './generalLedger';
export * from './asset';

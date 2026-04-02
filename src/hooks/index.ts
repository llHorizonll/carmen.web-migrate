/**
 * Hooks Index
 * Export all React hooks
 */

// ============================================================================
// Carmen Auth Hooks
// ============================================================================

export {
  useCarmenAuth,
  useCarmenUser,
  useCarmenToken,
  carmenAuthKeys,
  type UseCarmenAuthReturn,
  type UseCarmenUserReturn,
  type UseCarmenTokenReturn,
} from './useCarmenAuth';

// ============================================================================
// Legacy Hooks
// ============================================================================

export * from './useAuth';
export * from './useJournalVoucher';
export * from './useAllocationVoucher';
export * from './useStandardVoucher';
export * from './useAmortizationVoucher';
export * from './useApInvoice';
export * from './useApPayment';
export * from './useApVendor';
export * from './useArInvoice';
export * from './useArReceipt';
export * from './useArProfile';
export * from './useAsset';

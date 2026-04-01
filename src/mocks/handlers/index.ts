/**
 * MSW Handlers Index
 * Combines all module handlers for MSW setup
 */

import { journalVoucherHandlers, allocationVoucherHandlers, standardVoucherHandlers, amortizationVoucherHandlers } from './glHandlers';
import { apInvoiceHandlers, apPaymentHandlers, apVendorHandlers } from './apHandlers';
import { arInvoiceHandlers, arReceiptHandlers, arProfileHandlers } from './arHandlers';
import { assetRegisterHandlers, preAssetHandlers, assetDisposalHandlers } from './assetHandlers';

export const handlers = [
  // GL Handlers
  ...journalVoucherHandlers,
  ...allocationVoucherHandlers,
  ...standardVoucherHandlers,
  ...amortizationVoucherHandlers,
  
  // AP Handlers
  ...apInvoiceHandlers,
  ...apPaymentHandlers,
  ...apVendorHandlers,
  
  // AR Handlers
  ...arInvoiceHandlers,
  ...arReceiptHandlers,
  ...arProfileHandlers,
  
  // Asset Handlers
  ...assetRegisterHandlers,
  ...preAssetHandlers,
  ...assetDisposalHandlers,
];

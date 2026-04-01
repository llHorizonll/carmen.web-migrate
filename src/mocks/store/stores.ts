/**
 * Mock Store Instances
 * In-memory data stores for all entities
 */

import { BaseStore } from './BaseStore';
import type {
  JournalVoucher,
  AllocationVoucher,
  StandardVoucher,
  AmortizationVoucher,
  ChartOfAccount,
  Budget,
  ApInvoice,
  ApPayment,
  ApVendor,
  ArInvoice,
  ArReceipt,
  ArProfile,
  AssetRegister,
} from '../../types';

import {
  generateJournalVouchers,
  generateAllocationVouchers,
  generateStandardVouchers,
  generateAmortizationVouchers,
  generateChartOfAccounts,
  generateBudgets,
  generateApVendors,
  generateApInvoices,
  generateApPayments,
  generateArProfiles,
  generateArInvoices,
  generateArReceipts,
  generateAssetRegisters,
  generatePreAssets,
} from '../data';

// GL Stores
export const journalVoucher = new BaseStore<JournalVoucher>(
  generateJournalVouchers(50),
  'JvhSeq'
);

export const allocationVoucher = new BaseStore<AllocationVoucher>(
  generateAllocationVouchers(30),
  'AJvhSeq'
);

export const standardVoucher = new BaseStore<StandardVoucher>(
  generateStandardVouchers(20),
  'FJvhSeq'
);

export const amortizationVoucher = new BaseStore<AmortizationVoucher>(
  generateAmortizationVouchers(15),
  'FJvhSeq'
);

export const chartOfAccount = new BaseStore<ChartOfAccount>(
  generateChartOfAccounts(),
  'AccId'
);

export const budget = new BaseStore<Budget>(
  generateBudgets(20),
  'BudgetId'
);

// AP Stores
export const apVendor = new BaseStore<ApVendor>(
  generateApVendors(30),
  'VendorId'
);

export const apInvoice = new BaseStore<ApInvoice>(
  generateApInvoices(50),
  'ApInvhSeq'
);

export const apPayment = new BaseStore<ApPayment>(
  generateApPayments(40),
  'ApPmtSeq'
);

// AR Stores
export const arProfile = new BaseStore<ArProfile>(
  generateArProfiles(30),
  'ProfileId'
);

export const arInvoice = new BaseStore<ArInvoice>(
  generateArInvoices(50),
  'ArInvhSeq'
);

export const arReceipt = new BaseStore<ArReceipt>(
  generateArReceipts(40),
  'ArRcptSeq'
);

// Asset Stores
export const assetRegister = new BaseStore<AssetRegister>(
  generateAssetRegisters(50),
  'AssetId'
);

export const preAsset = new BaseStore<AssetRegister>(
  generatePreAssets(15),
  'AssetId'
);

// Store registry for easy access
export const stores = {
  gl: {
    journalVoucher,
    allocationVoucher,
    standardVoucher,
    amortizationVoucher,
    chartOfAccount,
    budget,
  },
  ap: {
    vendor: apVendor,
    invoice: apInvoice,
    payment: apPayment,
  },
  ar: {
    profile: arProfile,
    invoice: arInvoice,
    receipt: arReceipt,
  },
  asset: {
    register: assetRegister,
    preAsset,
  },
};

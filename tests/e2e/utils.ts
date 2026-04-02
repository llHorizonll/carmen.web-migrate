import { test, expect, type Page } from '@playwright/test';

/**
 * Test Utilities for Carmen E2E Tests
 * Common helper functions used across test files
 */

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Check if element exists and is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector).first();
  return await element.isVisible().catch(() => false);
}

/**
 * Safe click that checks if element exists first
 */
export async function safeClick(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector).first();
  if (await element.isVisible().catch(() => false)) {
    await element.click();
    return true;
  }
  return false;
}

/**
 * Fill form field if it exists
 */
export async function fillFieldIfExists(
  page: Page, 
  selector: string, 
  value: string
): Promise<boolean> {
  const element = page.locator(selector).first();
  if (await element.isVisible().catch(() => false)) {
    await element.fill(value);
    return true;
  }
  return false;
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page): Promise<number> {
  const rows = page.locator('table tbody tr, [role="row"]:has([role="cell"])');
  return await rows.count();
}

/**
 * Navigate to page and verify load
 */
export async function navigateAndVerify(
  page: Page, 
  url: string, 
  expectedText: string
): Promise<void> {
  await page.goto(url);
  await waitForPageLoad(page);
  await expect(page.getByText(expectedText)).toBeVisible();
}

/**
 * Common test data
 */
export const testData = {
  arProfile: {
    code: 'TEST-AR-001',
    name: 'Test AR Profile',
    contact: 'Test Contact',
    phone: '1234567890',
  },
  arInvoice: {
    number: 'INV-TEST-001',
    amount: '1000.00',
    description: 'Test Invoice',
  },
  arReceipt: {
    number: 'RCPT-TEST-001',
    amount: '500.00',
    description: 'Test Receipt',
  },
  apInvoice: {
    number: 'AP-INV-TEST-001',
    amount: '2000.00',
    description: 'Test AP Invoice',
  },
  apPayment: {
    number: 'PMT-TEST-001',
    amount: '1500.00',
    chequeNo: 'CHQ-001',
  },
  journalVoucher: {
    prefix: 'JV',
    description: 'Test Journal Voucher',
  },
  asset: {
    code: 'AST-TEST-001',
    name: 'Test Asset',
    purchasePrice: '50000.00',
  },
};

/**
 * Common selectors
 */
export const selectors = {
  // Buttons
  createButton: 'button:has-text("Create"), button:has-text("New"), button:has-text("Add")',
  saveButton: 'button[type="submit"], button:has-text("Save")',
  cancelButton: 'button:has-text("Cancel"), button:has-text("Back")',
  deleteButton: 'button:has-text("Delete")',
  editButton: 'button[title="Edit"], button:has(.tabler-icon-edit)',
  viewButton: 'button[title="View"], button:has(.tabler-icon-eye)',
  
  // Form elements
  submitButton: 'button[type="submit"]',
  textInput: 'input[type="text"]',
  passwordInput: 'input[type="password"]',
  select: 'select, [role="combobox"]',
  
  // Table
  table: 'table, [role="table"]',
  tableRow: 'table tbody tr, [role="row"]:has([role="cell"])',
  tableHeader: 'th, [role="columnheader"]',
  
  // Common components
  modal: '[role="dialog"]',
  notification: '.mantine-Notification-root',
  loadingSpinner: '.mantine-LoadingOverlay-root, [data-loading]',
  pagination: '.mantine-Pagination-root',
};

/**
 * Expected page titles/routes
 */
export const routes = {
  login: '/login',
  dashboard: '/dashboard',
  ar: {
    folio: '/ar/folio',
    profile: '/ar/profile',
    profileCreate: '/ar/profile/create',
    invoice: '/ar/invoice',
    invoiceCreate: '/ar/invoice/new',
    receipt: '/ar/receipt',
    receiptCreate: '/ar/receipt/create',
  },
  ap: {
    invoice: '/ap/invoice',
    invoiceCreate: '/ap/invoice/new',
    payment: '/ap/payment',
    paymentCreate: '/ap/payment/new',
  },
  gl: {
    journalVoucher: '/gl/journal-voucher',
    journalVoucherCreate: '/gl/journal-voucher/create',
  },
  asset: {
    register: '/asset/register',
    registerCreate: '/asset/register/new',
  },
};

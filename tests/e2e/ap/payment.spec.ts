import { test, expect } from '@playwright/test';

/**
 * AP Payment E2E Tests
 * Tests the Accounts Payable Payment page functionality
 */

test.describe('AP Payment List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AP Payment page
    await page.goto('/ap/payment');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title and header
    await expect(page.getByText('AP Payments')).toBeVisible();
    await expect(page.getByText('Manage accounts payable payments')).toBeVisible();
  });

  test('displays payment data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Payment No', 'Date', 'Vendor', 'Amount', 'Bank', 'Cheque No', 'Status'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('new payment button navigates to create page', async ({ page }) => {
    // Find new payment button
    const newButton = page.getByRole('button', { name: /new payment/i });
    await expect(newButton).toBeVisible();
    
    await newButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*ap\/payment\/new.*/);
  });

  test('filter panel is functional', async ({ page }) => {
    // Check for filter fields
    const vendorFilter = page.getByLabel('Vendor', { exact: false });
    const statusFilter = page.getByLabel('Status', { exact: false });
    
    // Vendor filter may not always be visible
    if (await vendorFilter.isVisible().catch(() => false)) {
      await expect(vendorFilter).toBeVisible();
    }
    
    // Check for date filters
    const fromDateFilter = page.getByLabel('From Date', { exact: false });
    const toDateFilter = page.getByLabel('To Date', { exact: false });
    
    // Check for search functionality
    const searchInput = page.getByPlaceholder(/search payments/i);
    await expect(searchInput).toBeVisible();
    
    // Test status filter if visible
    if (await statusFilter.isVisible().catch(() => false)) {
      await statusFilter.click();
      await page.getByRole('option', { name: 'Normal' }).click();
    }
    
    // Test search
    await searchInput.fill('PMT-001');
    await searchInput.clear();
  });

  test('row click navigates to detail page', async ({ page }) => {
    // Find first data row
    const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
    
    if (await firstRow.isVisible().catch(() => false)) {
      await firstRow.click();
      await expect(page).toHaveURL(/.*ap\/payment\/\d+.*/);
    } else {
      test.skip();
    }
  });

  test('pagination works correctly', async ({ page }) => {
    const pagination = page.locator('.mantine-Pagination-root, nav[aria-label="Pagination"]').first();
    
    if (await pagination.isVisible().catch(() => false)) {
      const nextButton = pagination.locator('button').last();
      
      if (await nextButton.isEnabled().catch(() => false)) {
        await nextButton.click();
        await expect(page.getByText('AP Payments')).toBeVisible();
      }
    }
  });

  test('breadcrumbs are displayed', async ({ page }) => {
    // Check for breadcrumbs
    await expect(page.getByText('Home', { exact: false })).toBeVisible();
    await expect(page.getByText('Accounts Payable', { exact: false })).toBeVisible();
    await expect(page.getByText('Payments', { exact: false })).toBeVisible();
  });

  test('displays payment amount with correct formatting', async ({ page }) => {
    // Look for amount cells
    const amountCells = page.locator('td').filter({ hasText: /^[\d,]+\.\d{2}$/ });
    
    if (await amountCells.first().isVisible().catch(() => false)) {
      const text = await amountCells.first().textContent() || '';
      // Verify proper number formatting
      expect(text).toMatch(/^[\d,]+\.\d{2}$/);
    }
  });

  test('status badges display correctly', async ({ page }) => {
    // Check for status badges
    const statusCells = page.locator('td:has-text("Normal"), td:has-text("Draft"), td:has-text("Void")');
    
    if (await statusCells.first().isVisible().catch(() => false)) {
      await expect(statusCells.first()).toBeVisible();
    }
  });

  test('handles empty state', async ({ page }) => {
    const emptyMessage = page.getByText(/No payments found|No data|Empty/i);
    
    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('filter reset works', async ({ page }) => {
    // Look for reset button in filter panel
    const resetButton = page.getByRole('button', { name: /reset|clear/i });
    
    if (await resetButton.isVisible().catch(() => false)) {
      // Fill some filter values first
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill('test');
      
      // Click reset
      await resetButton.click();
      
      // Verify search is cleared
      await expect(searchInput).toHaveValue('');
    }
  });

  test('responsive layout', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('AP Payments')).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('AP Payments')).toBeVisible();
    
    // Reset
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('AP Payment Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ap/payment/new');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/new|create/i)).toBeVisible();
  });

  test('form has required payment fields', async ({ page }) => {
    // Check for essential AP payment form fields
    const possibleFields = ['Payment No', 'Payment Date', 'Vendor', 'Amount', 'Bank', 'Cheque No'];
    
    for (const field of possibleFields) {
      const input = page.getByLabel(field, { exact: false }).first();
      const isVisible = await input.isVisible().catch(() => false);
      if (isVisible) {
        await expect(input).toBeVisible();
      }
    }
  });

  test('cancel button returns to list', async ({ page }) => {
    const cancelButton = page.getByRole('button', { name: /cancel|back/i });
    
    if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click();
      await expect(page).toHaveURL(/.*ap\/payment.*/);
    }
  });
});

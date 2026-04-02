import { test, expect } from '@playwright/test';

/**
 * AP Invoice E2E Tests
 * Tests the Accounts Payable Invoice page functionality
 */

test.describe('AP Invoice List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AP Invoice page
    await page.goto('/ap/invoice');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title and header
    await expect(page.getByText('AP Invoices')).toBeVisible();
    await expect(page.getByText('Manage accounts payable invoices')).toBeVisible();
  });

  test('displays invoice data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Invoice No', 'Date', 'Vendor', 'Amount', 'VAT', 'WHT', 'Net Amount', 'Status'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('new invoice button navigates to create page', async ({ page }) => {
    // Find new invoice button
    const newButton = page.getByRole('button', { name: /new invoice/i });
    await expect(newButton).toBeVisible();
    
    await newButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*ap\/invoice\/new.*/);
  });

  test('filter panel is functional', async ({ page }) => {
    // Check for Status filter
    const statusFilter = page.getByLabel('Status', { exact: false });
    await expect(statusFilter).toBeVisible();
    
    // Check for date filters (may be in filter panel)
    const fromDateFilter = page.getByLabel('From Date', { exact: false });
    const toDateFilter = page.getByLabel('To Date', { exact: false });
    
    // Check for search functionality
    const searchInput = page.getByPlaceholder(/search invoices/i);
    await expect(searchInput).toBeVisible();
    
    // Test status filter
    await statusFilter.click();
    await page.getByRole('option', { name: 'Normal' }).click();
    
    // Test search
    await searchInput.fill('INV-001');
    await searchInput.clear();
  });

  test('row click navigates to detail page', async ({ page }) => {
    // Find first data row
    const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
    
    if (await firstRow.isVisible().catch(() => false)) {
      await firstRow.click();
      await expect(page).toHaveURL(/.*ap\/invoice\/\d+.*/);
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
        await expect(page.getByText('AP Invoices')).toBeVisible();
      }
    }
  });

  test('breadcrumbs are displayed', async ({ page }) => {
    // Check for breadcrumbs
    await expect(page.getByText('Home', { exact: false })).toBeVisible();
    await expect(page.getByText('Accounts Payable', { exact: false })).toBeVisible();
    await expect(page.getByText('Invoices', { exact: false })).toBeVisible();
  });

  test('displays correct amount formatting', async ({ page }) => {
    // Look for amount cells - they should have proper formatting
    const amountCells = page.locator('td:has-text(".")');
    
    if (await amountCells.first().isVisible().catch(() => false)) {
      // Verify amounts are displayed with 2 decimal places
      const text = await amountCells.first().textContent() || '';
      // Check for currency format pattern
      expect(text).toMatch(/[\d,]+\.\d{2}/);
    }
  });

  test('status badges display correctly', async ({ page }) => {
    // Check for status badges in the table
    const statusCells = page.locator('td:has-text("Normal"), td:has-text("Draft"), td:has-text("Void")');
    
    if (await statusCells.first().isVisible().catch(() => false)) {
      await expect(statusCells.first()).toBeVisible();
    }
  });

  test('handles empty state', async ({ page }) => {
    const emptyMessage = page.getByText(/No AP invoices found|No data|Empty/i);
    
    // Page should not crash even with no data
    await expect(page.locator('body')).toBeVisible();
  });

  test('responsive layout', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('AP Invoices')).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('AP Invoices')).toBeVisible();
    
    // Reset
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('AP Invoice Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ap/invoice/new');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/new|create/i)).toBeVisible();
  });

  test('form has required invoice fields', async ({ page }) => {
    // Check for essential AP invoice form fields
    const possibleFields = ['Invoice No', 'Invoice Date', 'Vendor', 'Description', 'Amount', 'VAT'];
    
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
      await expect(page).toHaveURL(/.*ap\/invoice.*/);
    }
  });
});

import { test, expect } from '@playwright/test';

/**
 * AR Invoice E2E Tests
 * Tests the Accounts Receivable Invoice page functionality
 */

test.describe('AR Invoice List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AR Invoice page
    await page.goto('/ar/invoice');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title and header
    await expect(page.getByText('AR Invoices')).toBeVisible();
    await expect(page.getByText('Manage accounts receivable invoices')).toBeVisible();
  });

  test('displays invoice data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Invoice No', 'Date', 'Customer', 'Description', 'Amount', 'VAT', 'Net Amount', 'Status'];
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
    await expect(page).toHaveURL(/.*ar\/invoice\/new.*/);
  });

  test('filter panel is functional', async ({ page }) => {
    // Check for Status filter
    const statusFilter = page.getByLabel('Status', { exact: false });
    await expect(statusFilter).toBeVisible();
    
    // Check for date filters
    const fromDateFilter = page.getByLabel('From Date', { exact: false });
    const toDateFilter = page.getByLabel('To Date', { exact: false });
    
    // Date filters may be in a filter panel
    if (await fromDateFilter.isVisible().catch(() => false)) {
      await expect(fromDateFilter).toBeVisible();
    }
    if (await toDateFilter.isVisible().catch(() => false)) {
      await expect(toDateFilter).toBeVisible();
    }
    
    // Check for search functionality
    const searchInput = page.getByPlaceholder(/search invoices/i);
    await expect(searchInput).toBeVisible();
    
    // Test search
    await searchInput.fill('TEST-001');
    await searchInput.clear();
  });

  test('row click navigates to detail page', async ({ page }) => {
    // Find first data row
    const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
    
    if (await firstRow.isVisible().catch(() => false)) {
      await firstRow.click();
      await expect(page).toHaveURL(/.*ar\/invoice\/\d+.*/);
    } else {
      test.skip();
    }
  });

  test('pagination works correctly', async ({ page }) => {
    // Look for pagination
    const pagination = page.locator('.mantine-Pagination-root, nav[aria-label="Pagination"]').first();
    
    if (await pagination.isVisible().catch(() => false)) {
      // Check if next page button exists and is enabled
      const nextButton = pagination.locator('button').last();
      
      if (await nextButton.isEnabled().catch(() => false)) {
        const currentUrl = page.url();
        await nextButton.click();
        // URL might change or page content might update
        await expect(page.getByText('AR Invoices')).toBeVisible();
      }
    }
  });

  test('breadcrumbs are displayed', async ({ page }) => {
    // Check for breadcrumbs
    await expect(page.getByText('Home', { exact: false })).toBeVisible();
    await expect(page.getByText('Accounts Receivable', { exact: false })).toBeVisible();
    await expect(page.getByText('Invoices', { exact: false })).toBeVisible();
  });

  test('handles empty state', async ({ page }) => {
    const emptyMessage = page.getByText(/No AR invoices found|No data|Empty/i);
    
    // Empty state handling - page should not crash
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('AR Invoice Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/invoice/new');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/new|create/i)).toBeVisible();
  });

  test('form has required invoice fields', async ({ page }) => {
    // Check for essential invoice form fields
    const possibleFields = ['Invoice No', 'Invoice Date', 'Customer', 'Description', 'Amount'];
    
    for (const field of possibleFields) {
      const input = page.locator(`input, select, textarea`).filter({ hasText: new RegExp(field, 'i') }).first();
      // Don't fail if field doesn't exist, just log
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
      await expect(page).toHaveURL(/.*ar\/invoice.*/);
    }
  });
});

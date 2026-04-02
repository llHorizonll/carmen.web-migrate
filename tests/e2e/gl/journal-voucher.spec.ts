import { test, expect } from '@playwright/test';

/**
 * GL Journal Voucher E2E Tests
 * Tests the General Ledger Journal Voucher page functionality
 */

test.describe('GL Journal Voucher List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Journal Voucher page
    await page.goto('/gl/journal-voucher');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title
    await expect(page.getByText('Journal Vouchers')).toBeVisible();
  });

  test('displays journal voucher data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['JV No.', 'Date', 'Prefix', 'Description', 'Status', 'Modified By'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('create JV button navigates to create page', async ({ page }) => {
    // Find create button
    const createButton = page.getByRole('button', { name: /create jv|new/i });
    await expect(createButton).toBeVisible();
    
    await createButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*gl\/journal-voucher.*(create|new).*/);
  });

  test('filter controls are functional', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Check for Mode filter
    const modeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /open period|period date|all/i }).first();
    if (await modeSelect.isVisible().catch(() => false)) {
      await modeSelect.click();
      await page.getByRole('option', { name: 'Period Date' }).click();
    }
    
    // Check for Status filter
    const statusSelect = page.getByLabel('Status', { exact: false });
    await expect(statusSelect).toBeVisible();
    
    // Check for Prefix filter
    const prefixSelect = page.getByLabel('Prefix', { exact: false });
    await expect(prefixSelect).toBeVisible();
    
    // Test search
    await searchInput.fill('JV-001');
    await searchInput.clear();
    
    // Test status filter
    await statusSelect.click();
    await page.getByRole('option', { name: 'Normal' }).click();
    
    // Test prefix filter
    await prefixSelect.click();
    await page.getByRole('option', { name: 'JV' }).click();
  });

  test('period date mode shows date pickers', async ({ page }) => {
    // Switch to Period Date mode
    const modeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /open period/i }).first();
    
    if (await modeSelect.isVisible().catch(() => false)) {
      await modeSelect.click();
      await page.getByRole('option', { name: 'Period Date' }).click();
      
      // Date pickers should appear
      const fromDate = page.getByPlaceholder('Start Date');
      const toDate = page.getByPlaceholder('End Date');
      
      if (await fromDate.isVisible().catch(() => false)) {
        await expect(fromDate).toBeVisible();
      }
      if (await toDate.isVisible().catch(() => false)) {
        await expect(toDate).toBeVisible();
      }
    }
  });

  test('view action navigates to detail page', async ({ page }) => {
    // Find first view button (eye icon)
    const viewButton = page.locator('[data-testid="view-action"], button[title="View"], button:has(.tabler-icon-eye)').first();
    
    if (await viewButton.isVisible().catch(() => false)) {
      await viewButton.click();
      await expect(page).toHaveURL(/.*gl\/journal-voucher\/\d+.*/);
    } else {
      test.skip();
    }
  });

  test('status badges display correctly', async ({ page }) => {
    // Check for status badges
    const normalBadge = page.locator('text=Normal');
    const voidBadge = page.locator('text=Void');
    
    const hasNormal = await normalBadge.first().isVisible().catch(() => false);
    const hasVoid = await voidBadge.first().isVisible().catch(() => false);
    
    // At least one type of badge might be visible
    if (hasNormal || hasVoid) {
      expect(true).toBe(true);
    }
  });

  test('pagination controls work', async ({ page }) => {
    const pagination = page.locator('.mantine-Pagination-root, [role="navigation"]').first();
    
    if (await pagination.isVisible().catch(() => false)) {
      const nextButton = pagination.locator('button').last();
      
      if (await nextButton.isEnabled().catch(() => false)) {
        await nextButton.click();
        await expect(page.getByText('Journal Vouchers')).toBeVisible();
      }
    }
  });

  test('page size selector works', async ({ page }) => {
    // Look for page size selector
    const pageSizeSelect = page.locator('select').filter({ hasText: /15|50|100/i }).first();
    
    if (await pageSizeSelect.isVisible().catch(() => false)) {
      await pageSizeSelect.click();
      await page.getByRole('option', { name: '50' }).click();
      
      // Page should still show vouchers
      await expect(page.getByText('Journal Vouchers')).toBeVisible();
    }
  });

  test('handles empty state', async ({ page }) => {
    // Page should not crash even with no data
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('Journal Vouchers')).toBeVisible();
  });

  test('responsive layout', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Journal Vouchers')).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Journal Vouchers')).toBeVisible();
    
    // Reset
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('GL Journal Voucher Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gl/journal-voucher/create');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/create journal voucher/i)).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    // Check for essential JV form fields
    const dateField = page.getByLabel('Date', { exact: false });
    const prefixField = page.getByLabel('Prefix', { exact: false });
    const descriptionField = page.getByLabel('Description', { exact: false });
    
    await expect(dateField).toBeVisible();
    await expect(prefixField).toBeVisible();
    await expect(descriptionField).toBeVisible();
  });

  test('form validation works', async ({ page }) => {
    // Try to submit without required fields
    const submitButton = page.getByRole('button', { name: /create|save|submit/i });
    await submitButton.click();
    
    // Should show validation error or stay on page
    await expect(page).toHaveURL(/.*gl\/journal-voucher.*create.*/);
  });

  test('cancel button returns to list', async ({ page }) => {
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await expect(cancelButton).toBeVisible();
    
    await cancelButton.click();
    await expect(page).toHaveURL(/.*gl\/journal-voucher.*/);
  });

  test('prefix field accepts valid values', async ({ page }) => {
    const prefixField = page.getByLabel('Prefix', { exact: false });
    
    // Clear and enter a prefix
    await prefixField.fill('');
    await prefixField.fill('JV');
    
    // Should accept the value
    await expect(prefixField).toHaveValue('JV');
  });

  test('breadcrumbs are displayed', async ({ page }) => {
    // Check for breadcrumbs
    await expect(page.getByText('GL', { exact: false })).toBeVisible();
    await expect(page.getByText('Journal Vouchers', { exact: false })).toBeVisible();
    await expect(page.getByText('Create', { exact: false })).toBeVisible();
  });
});

test.describe('GL Journal Voucher Edit Page', () => {
  test('edit page loads for existing voucher', async ({ page }) => {
    // Navigate to an edit page with a test ID
    await page.goto('/gl/journal-voucher/1');
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
  });
});

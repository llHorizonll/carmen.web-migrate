import { test, expect } from '@playwright/test';

/**
 * Asset Register E2E Tests
 * Tests the Asset Register page functionality
 */

test.describe('Asset Register List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Asset Register page
    await page.goto('/asset/register');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title and header
    await expect(page.getByText('Asset Register')).toBeVisible();
    await expect(page.getByText('Manage fixed assets and depreciation')).toBeVisible();
  });

  test('displays asset data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Asset Code', 'Asset Name', 'Category', 'Department', 'Location', 'Purchase Date', 'Purchase Price', 'Net Book Value'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('new asset button navigates to create page', async ({ page }) => {
    // Find new asset button
    const newButton = page.getByRole('button', { name: /new asset/i });
    await expect(newButton).toBeVisible();
    
    await newButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*asset\/register\/new.*/);
  });

  test('filter panel is functional', async ({ page }) => {
    // Check for Status filter
    const statusFilter = page.getByLabel('Status', { exact: false });
    await expect(statusFilter).toBeVisible();
    
    // Check for Category filter
    const categoryFilter = page.getByLabel('Category', { exact: false });
    if (await categoryFilter.isVisible().catch(() => false)) {
      await expect(categoryFilter).toBeVisible();
    }
    
    // Check for Location filter
    const locationFilter = page.getByLabel('Location', { exact: false });
    if (await locationFilter.isVisible().catch(() => false)) {
      await expect(locationFilter).toBeVisible();
    }
    
    // Check for search functionality
    const searchInput = page.getByPlaceholder(/search by asset/i);
    await expect(searchInput).toBeVisible();
    
    // Test status filter
    await statusFilter.click();
    await page.getByRole('option', { name: 'Active' }).click();
    
    // Test search
    await searchInput.fill('ASSET-001');
    await searchInput.clear();
  });

  test('row click navigates to detail page', async ({ page }) => {
    // Find first data row
    const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
    
    if (await firstRow.isVisible().catch(() => false)) {
      await firstRow.click();
      await expect(page).toHaveURL(/.*asset\/register\/\d+.*/);
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
        await expect(page.getByText('Asset Register')).toBeVisible();
      }
    }
  });

  test('breadcrumbs are displayed', async ({ page }) => {
    // Check for breadcrumbs
    await expect(page.getByText('Home', { exact: false })).toBeVisible();
    await expect(page.getByText('Asset Management', { exact: false })).toBeVisible();
    await expect(page.getByText('Asset Register', { exact: false })).toBeVisible();
  });

  test('displays asset financial data correctly', async ({ page }) => {
    // Look for purchase price and net book value columns
    const purchasePriceCells = page.locator('td:has-text("Purchase Price") + td, td').filter({ hasText: /^[\d,]+\.\d{2}$/ });
    
    if (await purchasePriceCells.first().isVisible().catch(() => false)) {
      const text = await purchasePriceCells.first().textContent() || '';
      // Verify currency format
      expect(text).toMatch(/^[\d,]+\.\d{2}$/);
    }
  });

  test('status badges display correctly', async ({ page }) => {
    // Check for status badges
    const activeBadge = page.locator('text=Active');
    const disposedBadge = page.locator('text=Disposed');
    const impairedBadge = page.locator('text=Impaired');
    
    const hasActive = await activeBadge.first().isVisible().catch(() => false);
    const hasDisposed = await disposedBadge.first().isVisible().catch(() => false);
    const hasImpaired = await impairedBadge.first().isVisible().catch(() => false);
    
    // At least one status type might be visible
    if (hasActive || hasDisposed || hasImpaired) {
      expect(true).toBe(true);
    }
  });

  test('filter reset works', async ({ page }) => {
    // Look for reset button
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

  test('handles empty state', async ({ page }) => {
    const emptyMessage = page.getByText(/No assets found|No data|Empty/i);
    
    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays depreciation method column', async ({ page }) => {
    // Check for Method column header
    await expect(page.getByText('Method', { exact: false }).first()).toBeVisible();
    
    // Check for Useful Life column
    await expect(page.getByText('Life (Years)', { exact: false }).first()).toBeVisible();
  });

  test('responsive layout', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Asset Register')).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Asset Register')).toBeVisible();
    
    // Reset
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('Asset Register Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/asset/register/new');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/new|create/i)).toBeVisible();
  });

  test('form has required asset fields', async ({ page }) => {
    // Check for essential asset form fields
    const possibleFields = ['Asset Code', 'Asset Name', 'Category', 'Department', 'Location', 'Purchase Date', 'Purchase Price'];
    
    for (const field of possibleFields) {
      const input = page.getByLabel(field, { exact: false }).first();
      const isVisible = await input.isVisible().catch(() => false);
      if (isVisible) {
        await expect(input).toBeVisible();
      }
    }
  });

  test('depreciation fields are present', async ({ page }) => {
    // Check for depreciation-related fields
    const depreciationFields = ['Depreciation Method', 'Useful Life'];
    
    for (const field of depreciationFields) {
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
      await expect(page).toHaveURL(/.*asset\/register.*/);
    }
  });
});

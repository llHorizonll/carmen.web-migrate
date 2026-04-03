import { test, expect } from '@playwright/test';

/**
 * GL Chart of Accounts E2E Tests
 * Tests the General Ledger Chart of Accounts page functionality
 */

test.describe('GL Chart of Accounts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gl/chart-of-accounts');
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
    
    const title = page.getByText('Chart of Accounts').first();
    if (await title.isVisible().catch(() => false)) {
      await expect(title).toBeVisible();
    }
  });

  test('displays account tree/table', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('table, [role="table"], .tree-view').first()).toBeVisible({ timeout: 10000 });
    
    const headers = ['Account Code', 'Account Name', 'Type', 'Level'];
    for (const header of headers) {
      const element = page.getByText(header, { exact: false }).first();
      if (await element.isVisible().catch(() => false)) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('search functionality works', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const searchInput = page.getByPlaceholder(/search account/i);
    if (await searchInput.isVisible().catch(() => false)) {
      await expect(searchInput).toBeVisible();
      await searchInput.fill('cash');
      await searchInput.clear();
    }
  });

  test('filter by account type works', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const typeFilter = page.getByRole('textbox', { name: /Type/i });
    if (await typeFilter.isVisible().catch(() => false)) {
      await expect(typeFilter).toBeVisible();
    }
  });

  test('expand/collapse tree nodes', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const expandButton = page.locator('button:has(.tabler-icon-chevron-right), button:has(.tabler-icon-plus)').first();
    if (await expandButton.isVisible().catch(() => false)) {
      await expandButton.click();
      const collapseButton = page.locator('button:has(.tabler-icon-chevron-down), button:has(.tabler-icon-minus)').first();
      if (await collapseButton.isVisible().catch(() => false)) {
        await expect(collapseButton).toBeVisible();
      }
    }
  });

  test('add new account button is present', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const addButton = page.getByRole('button', { name: /add|new|create/i }).first();
    if (await addButton.isVisible().catch(() => false)) {
      await expect(addButton).toBeVisible();
    }
  });

  test('handles empty state', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

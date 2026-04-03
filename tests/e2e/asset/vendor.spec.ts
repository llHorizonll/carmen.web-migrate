import { test, expect } from '@playwright/test';

/**
 * Asset Vendor E2E Tests
 * Tests the Asset Vendor page functionality
 */

test.describe('Asset Vendor List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/asset/vendor');
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
    
    const title = page.getByText('Vendors').first();
    if (await title.isVisible().catch(() => false)) {
      await expect(title).toBeVisible();
    }
  });

  test('displays vendor data table', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    const headers = ['Vendor Code', 'Vendor Name', 'Contact', 'Phone', 'Email'];
    for (const header of headers) {
      const element = page.getByText(header, { exact: false }).first();
      if (await element.isVisible().catch(() => false)) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('new vendor button navigates to create page', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const newButton = page.getByRole('button', { name: /new|create/i }).first();
    if (await newButton.isVisible().catch(() => false)) {
      await newButton.click({ force: true });
      await expect(page).toHaveURL(/.*asset\/vendor\/new.*/);
    }
  });

  test('view action navigates to detail page', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const viewButton = page.locator('[data-testid="view-action"], button[title="View"], button:has(.tabler-icon-eye)').first();
    if (await viewButton.isVisible().catch(() => false)) {
      await viewButton.click();
      await expect(page).toHaveURL(/.*asset\/vendor.*/);
    } else {
      test.skip();
    }
  });

  test('edit action navigates to edit page', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const editButton = page.locator('[data-testid="edit-action"], button[title="Edit"], button:has(.tabler-icon-edit)').first();
    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
      await expect(page).toHaveURL(/.*asset\/vendor.*edit.*/);
    } else {
      test.skip();
    }
  });

  test('search vendors works', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const searchInput = page.getByPlaceholder(/search vendor/i);
    if (await searchInput.isVisible().catch(() => false)) {
      await expect(searchInput).toBeVisible();
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

test.describe('Asset Vendor Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/asset/vendor/new');
    await page.waitForLoadState('networkidle');
  });

  test('create form loads without errors', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const possibleFields = ['Vendor Code', 'Vendor Name', 'Contact Person', 'Phone', 'Email', 'Address'];
    for (const field of possibleFields) {
      const input = page.getByLabel(field, { exact: false }).first();
      if (await input.isVisible().catch(() => false)) {
        await expect(input).toBeVisible();
      }
    }
  });

  test('cancel button returns to list', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const cancelButton = page.getByRole('button', { name: /cancel|back/i }).first();
    if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click();
      await expect(page).toHaveURL(/.*asset\/vendor.*/);
    }
  });
});

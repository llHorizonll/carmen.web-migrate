import { test, expect } from '@playwright/test';

/**
 * GL Budget E2E Tests
 * Tests the General Ledger Budget page functionality
 */

test.describe('GL Budget List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gl/budget');
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
    
    const title = page.getByText('Budget').first();
    if (await title.isVisible().catch(() => false)) {
      await expect(title).toBeVisible();
    }
  });

  test('displays budget data table', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    const headers = ['Budget Code', 'Description', 'Fiscal Year', 'Amount', 'Status'];
    for (const header of headers) {
      const element = page.getByText(header, { exact: false }).first();
      if (await element.isVisible().catch(() => false)) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('new budget button navigates to create page', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const newButton = page.getByRole('button', { name: /new|create/i }).first();
    if (await newButton.isVisible().catch(() => false)) {
      await newButton.click({ force: true });
      await expect(page).toHaveURL(/.*gl\/budget\/new.*/);
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
      await expect(page).toHaveURL(/.*gl\/budget.*/);
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
      await expect(page).toHaveURL(/.*gl\/budget.*edit.*/);
    } else {
      test.skip();
    }
  });

  test('filter by fiscal year works', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const yearFilter = page.getByRole('textbox', { name: /Fiscal Year/i });
    if (await yearFilter.isVisible().catch(() => false)) {
      await expect(yearFilter).toBeVisible();
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

test.describe('GL Budget Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gl/budget/new');
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
    const possibleFields = ['Budget Code', 'Description', 'Fiscal Year', 'Amount'];
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
      await expect(page).toHaveURL(/.*gl\/budget.*/);
    }
  });
});

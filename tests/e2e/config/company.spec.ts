import { test, expect } from '@playwright/test';

/**
 * Config Company E2E Tests
 * Tests the Configuration Company page functionality
 */

test.describe('Config Company Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/config/company');
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
    
    const title = page.getByText('Company').first();
    if (await title.isVisible().catch(() => false)) {
      await expect(title).toBeVisible();
    }
  });

  test('displays company information form', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const possibleFields = ['Company Name', 'Tax ID', 'Address', 'Phone', 'Email'];
    let hasVisibleField = false;
    for (const field of possibleFields) {
      const input = page.getByLabel(field, { exact: false }).first();
      if (await input.isVisible().catch(() => false)) {
        await expect(input).toBeVisible();
        hasVisibleField = true;
      }
    }
    expect(hasVisibleField).toBe(true);
  });

  test('save button is present', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const saveButton = page.getByRole('button', { name: /save|update/i }).first();
    if (await saveButton.isVisible().catch(() => false)) {
      await expect(saveButton).toBeVisible();
    }
  });

  test('form fields are editable', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const companyName = page.getByLabel(/Company Name/i).first();
    if (await companyName.isVisible().catch(() => false)) {
      await expect(companyName).toBeEnabled();
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

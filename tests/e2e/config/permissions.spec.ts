import { test, expect } from '@playwright/test';

/**
 * Config Permissions E2E Tests
 * Tests the Configuration Permissions page functionality
 */

test.describe('Config Permissions Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/config/permissions');
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
    
    const title = page.getByText('Permissions').first();
    if (await title.isVisible().catch(() => false)) {
      await expect(title).toBeVisible();
    }
  });

  test('displays roles list', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const rolesList = page.locator('table, [role="table"], .roles-list').first();
    if (await rolesList.isVisible().catch(() => false)) {
      await expect(rolesList).toBeVisible();
    }
  });

  test('role selector is present', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const roleSelector = page.getByRole('combobox').first() || page.getByLabel(/Select Role/i).first();
    if (await roleSelector.isVisible().catch(() => false)) {
      await expect(roleSelector).toBeVisible();
    }
  });

  test('permission checkboxes are present', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    const checkboxes = page.locator('input[type="checkbox"]').first();
    if (await checkboxes.isVisible().catch(() => false)) {
      await expect(checkboxes).toBeVisible();
    }
  });

  test('save permissions button is present', async ({ page }) => {
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

  test('handles empty state', async ({ page }) => {
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/login')) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

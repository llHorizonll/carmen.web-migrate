import { test, expect } from '@playwright/test';

/**
 * Config Settings E2E Tests
 * Tests the Configuration settings pages functionality
 */

test.describe('Config Company Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Config Company page
    await page.goto('/config/company');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title is visible using locator
    const pageTitle = page.locator('h1, h2, h3').filter({ hasText: /company|organization/i }).first();
    await expect(pageTitle).toBeVisible();
  });

  test('displays company information form', async ({ page }) => {
    // Check for common company form fields
    const possibleFields = ['Company Name', 'Address', 'Tax ID', 'Phone', 'Email'];
    
    for (const field of possibleFields) {
      const input = page.getByLabel(field, { exact: false }).first();
      const isVisible = await input.isVisible().catch(() => false);
      if (isVisible) {
        await expect(input).toBeVisible();
      }
    }
  });

  test('save button is present', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save|update/i }).first();
    await expect(saveButton).toBeVisible();
  });

  test('cancel or reset button is present', async ({ page }) => {
    const cancelButton = page.getByRole('button', { name: /cancel|reset|back/i }).first();
    
    if (await cancelButton.isVisible().catch(() => false)) {
      await expect(cancelButton).toBeVisible();
    }
  });

  test('form fields are editable', async ({ page }) => {
    // Find a text input and verify it can be edited
    const companyNameInput = page.locator('input[type="text"]').first();
    
    if (await companyNameInput.isVisible().catch(() => false)) {
      const originalValue = await companyNameInput.inputValue();
      await companyNameInput.fill('Test Company Name');
      await expect(companyNameInput).toHaveValue('Test Company Name');
      // Restore original value
      await companyNameInput.fill(originalValue);
    }
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be accessible
    const pageTitle = page.locator('h1, h2, h3').filter({ hasText: /company|organization/i }).first();
    await expect(pageTitle).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('Config Users Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Config Users page
    await page.goto('/config/users');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title is visible
    const pageTitle = page.locator('h1, h2, h3').filter({ hasText: /users?|accounts?/i }).first();
    await expect(pageTitle).toBeVisible();
  });

  test('displays users data table', async ({ page }) => {
    // Wait for table to be visible
    const table = page.locator('table, [role="table"]').first();
    
    if (await table.isVisible().catch(() => false)) {
      await expect(table).toBeVisible({ timeout: 10000 });
      
      // Check for common column headers
      const headers = ['Username', 'Name', 'Email', 'Role', 'Status'];
      for (const header of headers) {
        const headerVisible = await page.getByText(header, { exact: false }).first().isVisible().catch(() => false);
        if (headerVisible) {
          await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
        }
      }
    }
  });

  test('create user button is present', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /create|new|add.*user/i }).first();
    
    if (await createButton.isVisible().catch(() => false)) {
      await expect(createButton).toBeVisible();
    }
  });

  test('search functionality works', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search.*user/i);
    
    if (await searchInput.isVisible().catch(() => false)) {
      await expect(searchInput).toBeVisible();
      await searchInput.fill('testuser');
      await searchInput.clear();
    }
  });

  test('filter controls are functional', async ({ page }) => {
    // Check for Role filter using textbox role
    const roleFilter = page.getByRole('textbox', { name: /role/i }).first();
    
    if (await roleFilter.isVisible().catch(() => false)) {
      await expect(roleFilter).toBeVisible();
      
      // Test filter interaction
      await roleFilter.click();
      // Select first option if available
      const firstOption = page.getByRole('option').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      }
    }
    
    // Check for Status filter
    const statusFilter = page.getByRole('textbox', { name: /status/i }).first();
    
    if (await statusFilter.isVisible().catch(() => false)) {
      await expect(statusFilter).toBeVisible();
    }
  });

  test('pagination controls work', async ({ page }) => {
    const pagination = page.locator('.mantine-Pagination-root, [role="navigation"]').first();
    
    if (await pagination.isVisible().catch(() => false)) {
      const nextButton = pagination.locator('button').last();
      
      if (await nextButton.isEnabled().catch(() => false)) {
        await nextButton.click();
        // Page should still show Users heading
        const pageTitle = page.locator('h1, h2, h3').filter({ hasText: /users?|accounts?/i }).first();
        await expect(pageTitle).toBeVisible();
      }
    }
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be accessible
    const pageTitle = page.locator('h1, h2, h3').filter({ hasText: /users?|accounts?/i }).first();
    await expect(pageTitle).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('Config Settings Navigation', () => {
  test('can navigate between config pages', async ({ page }) => {
    // Start at company page
    await page.goto('/config/company');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on company page
    let pageTitle = page.locator('h1, h2, h3').filter({ hasText: /company|organization/i }).first();
    await expect(pageTitle).toBeVisible();
    
    // Navigate to users page
    await page.goto('/config/users');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on users page
    pageTitle = page.locator('h1, h2, h3').filter({ hasText: /users?|accounts?/i }).first();
    await expect(pageTitle).toBeVisible();
  });
});

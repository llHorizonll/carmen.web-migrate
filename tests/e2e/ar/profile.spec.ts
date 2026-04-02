import { test, expect } from '@playwright/test';

/**
 * AR Profile E2E Tests
 * Tests the Accounts Receivable Profile page functionality
 */

test.describe('AR Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AR Profile page
    await page.goto('/ar/profile');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title is visible
    await expect(page.getByText('AR Profile')).toBeVisible();
  });

  test('displays profile data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Code', 'Name', 'AR Type', 'Contact', 'Phone', 'Credit Limit', 'Currency', 'Status'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('create button navigates to create page', async ({ page }) => {
    // Find create button
    const createButton = page.getByRole('button', { name: /create|new|add/i });
    await expect(createButton).toBeVisible();
    
    await createButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*ar\/profile.*create.*/);
  });

  test('filter controls are functional', async ({ page }) => {
    // Check for AR Type filter
    const arTypeSelect = page.getByLabel('AR Type', { exact: false });
    await expect(arTypeSelect).toBeVisible();
    
    // Check for Status filter
    const statusSelect = page.getByLabel('Status', { exact: false });
    await expect(statusSelect).toBeVisible();
    
    // Check for Search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Test filter interactions
    await arTypeSelect.click();
    await page.getByRole('option', { name: 'All Types' }).click();
    
    await statusSelect.click();
    await page.getByRole('option', { name: 'Active' }).click();
    
    await searchInput.fill('test');
    await searchInput.clear();
  });

  test('view action navigates to detail page', async ({ page }) => {
    // Find first view button (eye icon)
    const viewButton = page.locator('[data-testid="view-action"], button[title="View"], button:has(.tabler-icon-eye)').first();
    
    // Only test if there's data
    if (await viewButton.isVisible().catch(() => false)) {
      await viewButton.click();
      await expect(page).toHaveURL(/.*ar\/profile\/\d+.*/);
    } else {
      test.skip();
    }
  });

  test('edit action navigates to edit page', async ({ page }) => {
    // Find first edit button (edit icon)
    const editButton = page.locator('[data-testid="edit-action"], button[title="Edit"], button:has(.tabler-icon-edit)').first();
    
    // Only test if there's data
    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
      await expect(page).toHaveURL(/.*ar\/profile\/\d+.*edit.*/);
    } else {
      test.skip();
    }
  });

  test('pagination controls work', async ({ page }) => {
    // Look for pagination controls
    const pagination = page.locator('.mantine-Pagination-root, [role="navigation"]').first();
    
    if (await pagination.isVisible().catch(() => false)) {
      // Try to go to next page if available
      const nextButton = pagination.locator('button').last();
      if (await nextButton.isEnabled().catch(() => false)) {
        await nextButton.click();
        // Page should still show AR Profile
        await expect(page.getByText('AR Profile')).toBeVisible();
      }
    }
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be accessible
    await expect(page.getByText('AR Profile')).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('AR Profile Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/profile/create');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/create|new/i)).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    // Check for form fields
    const formFields = ['Profile Code', 'Profile Name', 'AR Type', 'Currency'];
    for (const field of formFields) {
      const input = page.getByLabel(field, { exact: false }).first();
      await expect(input).toBeVisible();
    }
  });

  test('cancel button returns to list', async ({ page }) => {
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await expect(cancelButton).toBeVisible();
    
    await cancelButton.click();
    await expect(page).toHaveURL(/.*ar\/profile.*/);
  });
});

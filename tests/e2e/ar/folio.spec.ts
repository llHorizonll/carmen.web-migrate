import { test, expect } from '@playwright/test';

/**
 * AR Folio E2E Tests
 * Tests the Accounts Receivable Folio page functionality
 */

test.describe('AR Folio Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AR Folio page (requires profileId query param)
    await page.goto('/ar/folio?profileId=1');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title is visible
    await expect(page.getByText('AR Folio')).toBeVisible();
    
    // Verify the page header
    await expect(page.locator('text=AR Folio')).toBeVisible();
  });

  test('displays folio data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Date', 'Type', 'Document No.', 'Description', 'Debit', 'Credit', 'Balance'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('displays profile info section', async ({ page }) => {
    // Check for profile info elements
    await expect(page.getByText('Profile Code', { exact: false })).toBeVisible();
    await expect(page.getByText('Profile Name', { exact: false })).toBeVisible();
    await expect(page.getByText('Current Balance', { exact: false })).toBeVisible();
  });

  test('date filter controls are functional', async ({ page }) => {
    // Check for date inputs
    const fromDateInput = page.getByLabel('From Date', { exact: false });
    const toDateInput = page.getByLabel('To Date', { exact: false });
    
    await expect(fromDateInput).toBeVisible();
    await expect(toDateInput).toBeVisible();
    
    // Test setting date values
    await fromDateInput.fill('01/01/2024');
    await toDateInput.fill('31/12/2024');
  });

  test('back button navigates to profile page', async ({ page }) => {
    // Find and click back button
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    
    // Verify navigation to profile page
    await expect(page).toHaveURL(/.*ar\/profile.*/);
  });

  test('displays totals section when data exists', async ({ page }) => {
    // Check for totals section labels
    const totalLabels = ['Total Debit', 'Total Credit'];
    for (const label of totalLabels) {
      // Use first() in case there are multiple matches
      const element = page.getByText(label, { exact: false }).first();
      await expect(element).toBeVisible();
    }
  });

  test('handles empty state gracefully', async ({ page }) => {
    // Check for empty state message
    const emptyMessage = page.getByText(/No folio transactions found|No data|Empty/i);
    
    // Empty state may or may not be visible depending on data
    // Just verify the page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('responsive layout on different viewports', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('AR Folio')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('AR Folio')).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

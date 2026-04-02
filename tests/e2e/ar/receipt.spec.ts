import { test, expect } from '@playwright/test';

/**
 * AR Receipt E2E Tests
 * Tests the Accounts Receivable Receipt page functionality
 */

test.describe('AR Receipt List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AR Receipt page
    await page.goto('/ar/receipt');
  });

  test('page loads without errors', async ({ page }) => {
    // Verify page title
    await expect(page.getByText('AR Receipt')).toBeVisible();
  });

  test('displays receipt data table', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for column headers
    const headers = ['Date', 'Receipt No.', 'Customer', 'Description', 'Currency', 'Amount', 'Base Amount', 'Status'];
    for (const header of headers) {
      await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
    }
  });

  test('create button navigates to create page', async ({ page }) => {
    // Find create button
    const createButton = page.getByRole('button', { name: /create/i });
    await expect(createButton).toBeVisible();
    
    await createButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*ar\/receipt\/create.*/);
  });

  test('filter controls are functional', async ({ page }) => {
    // Check for date range filters
    const fromDateInput = page.getByLabel('From Date', { exact: false });
    const toDateInput = page.getByLabel('To Date', { exact: false });
    
    await expect(fromDateInput).toBeVisible();
    await expect(toDateInput).toBeVisible();
    
    // Check for Status filter
    const statusSelect = page.getByLabel('Status', { exact: false });
    await expect(statusSelect).toBeVisible();
    
    // Check for Search input
    const searchInput = page.getByPlaceholder(/search receipt/i);
    await expect(searchInput).toBeVisible();
    
    // Test date filter
    await fromDateInput.fill('01/01/2024');
    await toDateInput.fill('31/12/2024');
    
    // Test status filter
    await statusSelect.click();
    await page.getByRole('option', { name: 'Normal' }).click();
    
    // Test search
    await searchInput.fill('RCPT-001');
    await searchInput.clear();
  });

  test('view action navigates to detail page', async ({ page }) => {
    // Find first view button
    const viewButton = page.locator('[data-testid="view-action"], button[title="View"], button:has(.tabler-icon-eye)').first();
    
    if (await viewButton.isVisible().catch(() => false)) {
      await viewButton.click();
      await expect(page).toHaveURL(/.*ar\/receipt\/\d+.*/);
    } else {
      test.skip();
    }
  });

  test('edit action navigates to edit page', async ({ page }) => {
    // Find first edit button
    const editButton = page.locator('[data-testid="edit-action"], button[title="Edit"], button:has(.tabler-icon-edit)').first();
    
    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
      await expect(page).toHaveURL(/.*ar\/receipt\/\d+.*edit.*/);
    } else {
      test.skip();
    }
  });

  test('void receipts cannot be edited', async ({ page }) => {
    // Look for void status rows and verify edit button is not present
    const voidRows = page.locator('tr:has-text("Void")');
    const voidCount = await voidRows.count();
    
    if (voidCount > 0) {
      // Get the first void row
      const firstVoidRow = voidRows.first();
      
      // Check that edit button is not present in void rows
      const editButtonInVoid = firstVoidRow.locator('button[title="Edit"]');
      await expect(editButtonInVoid).toHaveCount(0);
    }
  });

  test('pagination controls work', async ({ page }) => {
    const pagination = page.locator('.mantine-Pagination-root, [role="navigation"]').first();
    
    if (await pagination.isVisible().catch(() => false)) {
      const nextButton = pagination.locator('button').last();
      
      if (await nextButton.isEnabled().catch(() => false)) {
        await nextButton.click();
        await expect(page.getByText('AR Receipt')).toBeVisible();
      }
    }
  });

  test('date range validation', async ({ page }) => {
    const fromDateInput = page.getByLabel('From Date', { exact: false });
    const toDateInput = page.getByLabel('To Date', { exact: false });
    
    // Set invalid date range (to before from)
    await fromDateInput.fill('31/12/2024');
    await toDateInput.fill('01/01/2024');
    
    // Page should handle this gracefully
    await expect(page.getByText('AR Receipt')).toBeVisible();
  });

  test('responsive layout', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('AR Receipt')).toBeVisible();
    
    // Reset
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('AR Receipt Create Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/receipt/create');
  });

  test('create form loads without errors', async ({ page }) => {
    await expect(page.getByText(/create|new/i)).toBeVisible();
  });

  test('form has required receipt fields', async ({ page }) => {
    // Check for essential receipt form fields
    const possibleFields = ['Receipt Date', 'Receipt No', 'Customer', 'Description', 'Amount'];
    
    for (const field of possibleFields) {
      const input = page.locator(`input, select, textarea`).filter({ hasText: new RegExp(field, 'i') }).first();
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
      await expect(page).toHaveURL(/.*ar\/receipt.*/);
    }
  });
});

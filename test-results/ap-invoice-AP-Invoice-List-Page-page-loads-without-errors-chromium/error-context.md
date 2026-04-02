# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ap/invoice.spec.ts >> AP Invoice List Page >> page loads without errors
- Location: tests/e2e/ap/invoice.spec.ts:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('AP Invoices')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('AP Invoices')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Unexpected Application Error!" [level=2] [ref=e3]
  - heading "404 Not Found" [level=3] [ref=e4]
  - paragraph [ref=e5]: 💿 Hey developer 👋
  - paragraph [ref=e6]:
    - text: You can provide a way better UX than this when your app throws errors by providing your own
    - code [ref=e7]: ErrorBoundary
    - text: or
    - code [ref=e8]: errorElement
    - text: prop on your route.
  - generic [ref=e9]:
    - img [ref=e11]
    - button "Open Tanstack query devtools" [ref=e59] [cursor=pointer]:
      - img [ref=e60]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * AP Invoice E2E Tests
  5   |  * Tests the Accounts Payable Invoice page functionality
  6   |  */
  7   | 
  8   | test.describe('AP Invoice List Page', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // Navigate to AP Invoice page
  11  |     await page.goto('/ap/invoice');
  12  |   });
  13  | 
  14  |   test('page loads without errors', async ({ page }) => {
  15  |     // Verify page title and header
> 16  |     await expect(page.getByText('AP Invoices')).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  17  |     await expect(page.getByText('Manage accounts payable invoices')).toBeVisible();
  18  |   });
  19  | 
  20  |   test('displays invoice data table', async ({ page }) => {
  21  |     // Wait for table to be visible
  22  |     await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
  23  |     
  24  |     // Check for column headers
  25  |     const headers = ['Invoice No', 'Date', 'Vendor', 'Amount', 'VAT', 'WHT', 'Net Amount', 'Status'];
  26  |     for (const header of headers) {
  27  |       await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
  28  |     }
  29  |   });
  30  | 
  31  |   test('new invoice button navigates to create page', async ({ page }) => {
  32  |     // Find new invoice button
  33  |     const newButton = page.getByRole('button', { name: /new invoice/i });
  34  |     await expect(newButton).toBeVisible();
  35  |     
  36  |     await newButton.click();
  37  |     
  38  |     // Verify navigation
  39  |     await expect(page).toHaveURL(/.*ap\/invoice\/new.*/);
  40  |   });
  41  | 
  42  |   test('filter panel is functional', async ({ page }) => {
  43  |     // Check for Status filter
  44  |     const statusFilter = page.getByLabel('Status', { exact: false });
  45  |     await expect(statusFilter).toBeVisible();
  46  |     
  47  |     // Check for date filters (may be in filter panel)
  48  |     const fromDateFilter = page.getByLabel('From Date', { exact: false });
  49  |     const toDateFilter = page.getByLabel('To Date', { exact: false });
  50  |     
  51  |     // Check for search functionality
  52  |     const searchInput = page.getByPlaceholder(/search invoices/i);
  53  |     await expect(searchInput).toBeVisible();
  54  |     
  55  |     // Test status filter
  56  |     await statusFilter.click();
  57  |     await page.getByRole('option', { name: 'Normal' }).click();
  58  |     
  59  |     // Test search
  60  |     await searchInput.fill('INV-001');
  61  |     await searchInput.clear();
  62  |   });
  63  | 
  64  |   test('row click navigates to detail page', async ({ page }) => {
  65  |     // Find first data row
  66  |     const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
  67  |     
  68  |     if (await firstRow.isVisible().catch(() => false)) {
  69  |       await firstRow.click();
  70  |       await expect(page).toHaveURL(/.*ap\/invoice\/\d+.*/);
  71  |     } else {
  72  |       test.skip();
  73  |     }
  74  |   });
  75  | 
  76  |   test('pagination works correctly', async ({ page }) => {
  77  |     const pagination = page.locator('.mantine-Pagination-root, nav[aria-label="Pagination"]').first();
  78  |     
  79  |     if (await pagination.isVisible().catch(() => false)) {
  80  |       const nextButton = pagination.locator('button').last();
  81  |       
  82  |       if (await nextButton.isEnabled().catch(() => false)) {
  83  |         await nextButton.click();
  84  |         await expect(page.getByText('AP Invoices')).toBeVisible();
  85  |       }
  86  |     }
  87  |   });
  88  | 
  89  |   test('breadcrumbs are displayed', async ({ page }) => {
  90  |     // Check for breadcrumbs
  91  |     await expect(page.getByText('Home', { exact: false })).toBeVisible();
  92  |     await expect(page.getByText('Accounts Payable', { exact: false })).toBeVisible();
  93  |     await expect(page.getByText('Invoices', { exact: false })).toBeVisible();
  94  |   });
  95  | 
  96  |   test('displays correct amount formatting', async ({ page }) => {
  97  |     // Look for amount cells - they should have proper formatting
  98  |     const amountCells = page.locator('td:has-text(".")');
  99  |     
  100 |     if (await amountCells.first().isVisible().catch(() => false)) {
  101 |       // Verify amounts are displayed with 2 decimal places
  102 |       const text = await amountCells.first().textContent() || '';
  103 |       // Check for currency format pattern
  104 |       expect(text).toMatch(/[\d,]+\.\d{2}/);
  105 |     }
  106 |   });
  107 | 
  108 |   test('status badges display correctly', async ({ page }) => {
  109 |     // Check for status badges in the table
  110 |     const statusCells = page.locator('td:has-text("Normal"), td:has-text("Draft"), td:has-text("Void")');
  111 |     
  112 |     if (await statusCells.first().isVisible().catch(() => false)) {
  113 |       await expect(statusCells.first()).toBeVisible();
  114 |     }
  115 |   });
  116 | 
```
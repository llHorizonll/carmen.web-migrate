# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ar/invoice.spec.ts >> AR Invoice List Page >> displays invoice data table
- Location: tests/e2e/ar/invoice.spec.ts:20:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table, [role="table"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('table, [role="table"]').first()

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
  4   |  * AR Invoice E2E Tests
  5   |  * Tests the Accounts Receivable Invoice page functionality
  6   |  */
  7   | 
  8   | test.describe('AR Invoice List Page', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // Navigate to AR Invoice page
  11  |     await page.goto('/ar/invoice');
  12  |   });
  13  | 
  14  |   test('page loads without errors', async ({ page }) => {
  15  |     // Verify page title and header
  16  |     await expect(page.getByText('AR Invoices')).toBeVisible();
  17  |     await expect(page.getByText('Manage accounts receivable invoices')).toBeVisible();
  18  |   });
  19  | 
  20  |   test('displays invoice data table', async ({ page }) => {
  21  |     // Wait for table to be visible
> 22  |     await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
      |                                                                 ^ Error: expect(locator).toBeVisible() failed
  23  |     
  24  |     // Check for column headers
  25  |     const headers = ['Invoice No', 'Date', 'Customer', 'Description', 'Amount', 'VAT', 'Net Amount', 'Status'];
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
  39  |     await expect(page).toHaveURL(/.*ar\/invoice\/new.*/);
  40  |   });
  41  | 
  42  |   test('filter panel is functional', async ({ page }) => {
  43  |     // Check for Status filter
  44  |     const statusFilter = page.getByLabel('Status', { exact: false });
  45  |     await expect(statusFilter).toBeVisible();
  46  |     
  47  |     // Check for date filters
  48  |     const fromDateFilter = page.getByLabel('From Date', { exact: false });
  49  |     const toDateFilter = page.getByLabel('To Date', { exact: false });
  50  |     
  51  |     // Date filters may be in a filter panel
  52  |     if (await fromDateFilter.isVisible().catch(() => false)) {
  53  |       await expect(fromDateFilter).toBeVisible();
  54  |     }
  55  |     if (await toDateFilter.isVisible().catch(() => false)) {
  56  |       await expect(toDateFilter).toBeVisible();
  57  |     }
  58  |     
  59  |     // Check for search functionality
  60  |     const searchInput = page.getByPlaceholder(/search invoices/i);
  61  |     await expect(searchInput).toBeVisible();
  62  |     
  63  |     // Test search
  64  |     await searchInput.fill('TEST-001');
  65  |     await searchInput.clear();
  66  |   });
  67  | 
  68  |   test('row click navigates to detail page', async ({ page }) => {
  69  |     // Find first data row
  70  |     const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
  71  |     
  72  |     if (await firstRow.isVisible().catch(() => false)) {
  73  |       await firstRow.click();
  74  |       await expect(page).toHaveURL(/.*ar\/invoice\/\d+.*/);
  75  |     } else {
  76  |       test.skip();
  77  |     }
  78  |   });
  79  | 
  80  |   test('pagination works correctly', async ({ page }) => {
  81  |     // Look for pagination
  82  |     const pagination = page.locator('.mantine-Pagination-root, nav[aria-label="Pagination"]').first();
  83  |     
  84  |     if (await pagination.isVisible().catch(() => false)) {
  85  |       // Check if next page button exists and is enabled
  86  |       const nextButton = pagination.locator('button').last();
  87  |       
  88  |       if (await nextButton.isEnabled().catch(() => false)) {
  89  |         const currentUrl = page.url();
  90  |         await nextButton.click();
  91  |         // URL might change or page content might update
  92  |         await expect(page.getByText('AR Invoices')).toBeVisible();
  93  |       }
  94  |     }
  95  |   });
  96  | 
  97  |   test('breadcrumbs are displayed', async ({ page }) => {
  98  |     // Check for breadcrumbs
  99  |     await expect(page.getByText('Home', { exact: false })).toBeVisible();
  100 |     await expect(page.getByText('Accounts Receivable', { exact: false })).toBeVisible();
  101 |     await expect(page.getByText('Invoices', { exact: false })).toBeVisible();
  102 |   });
  103 | 
  104 |   test('handles empty state', async ({ page }) => {
  105 |     const emptyMessage = page.getByText(/No AR invoices found|No data|Empty/i);
  106 |     
  107 |     // Empty state handling - page should not crash
  108 |     await expect(page.locator('body')).toBeVisible();
  109 |   });
  110 | });
  111 | 
  112 | test.describe('AR Invoice Create Page', () => {
  113 |   test.beforeEach(async ({ page }) => {
  114 |     await page.goto('/ar/invoice/new');
  115 |   });
  116 | 
  117 |   test('create form loads without errors', async ({ page }) => {
  118 |     await expect(page.getByText(/new|create/i)).toBeVisible();
  119 |   });
  120 | 
  121 |   test('form has required invoice fields', async ({ page }) => {
  122 |     // Check for essential invoice form fields
```
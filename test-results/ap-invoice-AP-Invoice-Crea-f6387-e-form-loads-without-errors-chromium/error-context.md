# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ap/invoice.spec.ts >> AP Invoice Create Page >> create form loads without errors
- Location: tests/e2e/ap/invoice.spec.ts:143:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/new|create/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/new|create/i)

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
  117 |   test('handles empty state', async ({ page }) => {
  118 |     const emptyMessage = page.getByText(/No AP invoices found|No data|Empty/i);
  119 |     
  120 |     // Page should not crash even with no data
  121 |     await expect(page.locator('body')).toBeVisible();
  122 |   });
  123 | 
  124 |   test('responsive layout', async ({ page }) => {
  125 |     // Mobile viewport
  126 |     await page.setViewportSize({ width: 375, height: 667 });
  127 |     await expect(page.getByText('AP Invoices')).toBeVisible();
  128 |     
  129 |     // Tablet
  130 |     await page.setViewportSize({ width: 768, height: 1024 });
  131 |     await expect(page.getByText('AP Invoices')).toBeVisible();
  132 |     
  133 |     // Reset
  134 |     await page.setViewportSize({ width: 1280, height: 720 });
  135 |   });
  136 | });
  137 | 
  138 | test.describe('AP Invoice Create Page', () => {
  139 |   test.beforeEach(async ({ page }) => {
  140 |     await page.goto('/ap/invoice/new');
  141 |   });
  142 | 
  143 |   test('create form loads without errors', async ({ page }) => {
> 144 |     await expect(page.getByText(/new|create/i)).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  145 |   });
  146 | 
  147 |   test('form has required invoice fields', async ({ page }) => {
  148 |     // Check for essential AP invoice form fields
  149 |     const possibleFields = ['Invoice No', 'Invoice Date', 'Vendor', 'Description', 'Amount', 'VAT'];
  150 |     
  151 |     for (const field of possibleFields) {
  152 |       const input = page.getByLabel(field, { exact: false }).first();
  153 |       const isVisible = await input.isVisible().catch(() => false);
  154 |       if (isVisible) {
  155 |         await expect(input).toBeVisible();
  156 |       }
  157 |     }
  158 |   });
  159 | 
  160 |   test('cancel button returns to list', async ({ page }) => {
  161 |     const cancelButton = page.getByRole('button', { name: /cancel|back/i });
  162 |     
  163 |     if (await cancelButton.isVisible().catch(() => false)) {
  164 |       await cancelButton.click();
  165 |       await expect(page).toHaveURL(/.*ap\/invoice.*/);
  166 |     }
  167 |   });
  168 | });
  169 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ap/payment.spec.ts >> AP Payment List Page >> responsive layout
- Location: tests/e2e/ap/payment.spec.ts:147:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('AP Payments')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('AP Payments')

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
  50  |     }
  51  |     
  52  |     // Check for date filters
  53  |     const fromDateFilter = page.getByLabel('From Date', { exact: false });
  54  |     const toDateFilter = page.getByLabel('To Date', { exact: false });
  55  |     
  56  |     // Check for search functionality
  57  |     const searchInput = page.getByPlaceholder(/search payments/i);
  58  |     await expect(searchInput).toBeVisible();
  59  |     
  60  |     // Test status filter if visible
  61  |     if (await statusFilter.isVisible().catch(() => false)) {
  62  |       await statusFilter.click();
  63  |       await page.getByRole('option', { name: 'Normal' }).click();
  64  |     }
  65  |     
  66  |     // Test search
  67  |     await searchInput.fill('PMT-001');
  68  |     await searchInput.clear();
  69  |   });
  70  | 
  71  |   test('row click navigates to detail page', async ({ page }) => {
  72  |     // Find first data row
  73  |     const firstRow = page.locator('table tbody tr, [role="row"]:has([role="cell"])').first();
  74  |     
  75  |     if (await firstRow.isVisible().catch(() => false)) {
  76  |       await firstRow.click();
  77  |       await expect(page).toHaveURL(/.*ap\/payment\/\d+.*/);
  78  |     } else {
  79  |       test.skip();
  80  |     }
  81  |   });
  82  | 
  83  |   test('pagination works correctly', async ({ page }) => {
  84  |     const pagination = page.locator('.mantine-Pagination-root, nav[aria-label="Pagination"]').first();
  85  |     
  86  |     if (await pagination.isVisible().catch(() => false)) {
  87  |       const nextButton = pagination.locator('button').last();
  88  |       
  89  |       if (await nextButton.isEnabled().catch(() => false)) {
  90  |         await nextButton.click();
  91  |         await expect(page.getByText('AP Payments')).toBeVisible();
  92  |       }
  93  |     }
  94  |   });
  95  | 
  96  |   test('breadcrumbs are displayed', async ({ page }) => {
  97  |     // Check for breadcrumbs
  98  |     await expect(page.getByText('Home', { exact: false })).toBeVisible();
  99  |     await expect(page.getByText('Accounts Payable', { exact: false })).toBeVisible();
  100 |     await expect(page.getByText('Payments', { exact: false })).toBeVisible();
  101 |   });
  102 | 
  103 |   test('displays payment amount with correct formatting', async ({ page }) => {
  104 |     // Look for amount cells
  105 |     const amountCells = page.locator('td').filter({ hasText: /^[\d,]+\.\d{2}$/ });
  106 |     
  107 |     if (await amountCells.first().isVisible().catch(() => false)) {
  108 |       const text = await amountCells.first().textContent() || '';
  109 |       // Verify proper number formatting
  110 |       expect(text).toMatch(/^[\d,]+\.\d{2}$/);
  111 |     }
  112 |   });
  113 | 
  114 |   test('status badges display correctly', async ({ page }) => {
  115 |     // Check for status badges
  116 |     const statusCells = page.locator('td:has-text("Normal"), td:has-text("Draft"), td:has-text("Void")');
  117 |     
  118 |     if (await statusCells.first().isVisible().catch(() => false)) {
  119 |       await expect(statusCells.first()).toBeVisible();
  120 |     }
  121 |   });
  122 | 
  123 |   test('handles empty state', async ({ page }) => {
  124 |     const emptyMessage = page.getByText(/No payments found|No data|Empty/i);
  125 |     
  126 |     // Page should not crash
  127 |     await expect(page.locator('body')).toBeVisible();
  128 |   });
  129 | 
  130 |   test('filter reset works', async ({ page }) => {
  131 |     // Look for reset button in filter panel
  132 |     const resetButton = page.getByRole('button', { name: /reset|clear/i });
  133 |     
  134 |     if (await resetButton.isVisible().catch(() => false)) {
  135 |       // Fill some filter values first
  136 |       const searchInput = page.getByPlaceholder(/search/i);
  137 |       await searchInput.fill('test');
  138 |       
  139 |       // Click reset
  140 |       await resetButton.click();
  141 |       
  142 |       // Verify search is cleared
  143 |       await expect(searchInput).toHaveValue('');
  144 |     }
  145 |   });
  146 | 
  147 |   test('responsive layout', async ({ page }) => {
  148 |     // Mobile viewport
  149 |     await page.setViewportSize({ width: 375, height: 667 });
> 150 |     await expect(page.getByText('AP Payments')).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  151 |     
  152 |     // Tablet
  153 |     await page.setViewportSize({ width: 768, height: 1024 });
  154 |     await expect(page.getByText('AP Payments')).toBeVisible();
  155 |     
  156 |     // Reset
  157 |     await page.setViewportSize({ width: 1280, height: 720 });
  158 |   });
  159 | });
  160 | 
  161 | test.describe('AP Payment Create Page', () => {
  162 |   test.beforeEach(async ({ page }) => {
  163 |     await page.goto('/ap/payment/new');
  164 |   });
  165 | 
  166 |   test('create form loads without errors', async ({ page }) => {
  167 |     await expect(page.getByText(/new|create/i)).toBeVisible();
  168 |   });
  169 | 
  170 |   test('form has required payment fields', async ({ page }) => {
  171 |     // Check for essential AP payment form fields
  172 |     const possibleFields = ['Payment No', 'Payment Date', 'Vendor', 'Amount', 'Bank', 'Cheque No'];
  173 |     
  174 |     for (const field of possibleFields) {
  175 |       const input = page.getByLabel(field, { exact: false }).first();
  176 |       const isVisible = await input.isVisible().catch(() => false);
  177 |       if (isVisible) {
  178 |         await expect(input).toBeVisible();
  179 |       }
  180 |     }
  181 |   });
  182 | 
  183 |   test('cancel button returns to list', async ({ page }) => {
  184 |     const cancelButton = page.getByRole('button', { name: /cancel|back/i });
  185 |     
  186 |     if (await cancelButton.isVisible().catch(() => false)) {
  187 |       await cancelButton.click();
  188 |       await expect(page).toHaveURL(/.*ap\/payment.*/);
  189 |     }
  190 |   });
  191 | });
  192 | 
```
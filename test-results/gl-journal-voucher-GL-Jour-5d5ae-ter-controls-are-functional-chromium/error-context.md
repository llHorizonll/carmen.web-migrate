# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gl/journal-voucher.spec.ts >> GL Journal Voucher List Page >> filter controls are functional
- Location: tests/e2e/gl/journal-voucher.spec.ts:41:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByPlaceholder(/search/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByPlaceholder(/search/i)

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - heading "Sign In" [level=2] [ref=e12]
        - paragraph [ref=e13]: Enter your username to continue
      - separator [ref=e14]
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18]: Username
          - generic [ref=e19]:
            - img [ref=e21]
            - textbox "Username" [ref=e24]:
              - /placeholder: Enter your username
              - text: admin
        - button "Next" [ref=e26] [cursor=pointer]:
          - generic [ref=e28]: Next
      - paragraph [ref=e29]:
        - text: Copyright ©
        - link "Carmen Software Co.,Ltd." [ref=e30] [cursor=pointer]:
          - /url: https://carmensoftware.com/
        - text: "2026."
    - paragraph [ref=e32]:
      - text: 🔧 Developer Mode
      - text: "Default: Tenant=dev, UserName=admin, Password=alpha"
  - generic [ref=e33]:
    - img [ref=e35]
    - button "Open Tanstack query devtools" [ref=e83] [cursor=pointer]:
      - img [ref=e84]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * GL Journal Voucher E2E Tests
  5   |  * Tests the General Ledger Journal Voucher page functionality
  6   |  */
  7   | 
  8   | test.describe('GL Journal Voucher List Page', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // Navigate to Journal Voucher page
  11  |     await page.goto('/gl/journal-voucher');
  12  |   });
  13  | 
  14  |   test('page loads without errors', async ({ page }) => {
  15  |     // Verify page title
  16  |     await expect(page.getByText('Journal Vouchers')).toBeVisible();
  17  |   });
  18  | 
  19  |   test('displays journal voucher data table', async ({ page }) => {
  20  |     // Wait for table to be visible
  21  |     await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
  22  |     
  23  |     // Check for column headers
  24  |     const headers = ['JV No.', 'Date', 'Prefix', 'Description', 'Status', 'Modified By'];
  25  |     for (const header of headers) {
  26  |       await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
  27  |     }
  28  |   });
  29  | 
  30  |   test('create JV button navigates to create page', async ({ page }) => {
  31  |     // Find create button
  32  |     const createButton = page.getByRole('button', { name: /create jv|new/i });
  33  |     await expect(createButton).toBeVisible();
  34  |     
  35  |     await createButton.click();
  36  |     
  37  |     // Verify navigation
  38  |     await expect(page).toHaveURL(/.*gl\/journal-voucher.*(create|new).*/);
  39  |   });
  40  | 
  41  |   test('filter controls are functional', async ({ page }) => {
  42  |     // Check for search input
  43  |     const searchInput = page.getByPlaceholder(/search/i);
> 44  |     await expect(searchInput).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
  45  |     
  46  |     // Check for Mode filter
  47  |     const modeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /open period|period date|all/i }).first();
  48  |     if (await modeSelect.isVisible().catch(() => false)) {
  49  |       await modeSelect.click();
  50  |       await page.getByRole('option', { name: 'Period Date' }).click();
  51  |     }
  52  |     
  53  |     // Check for Status filter
  54  |     const statusSelect = page.getByLabel('Status', { exact: false });
  55  |     await expect(statusSelect).toBeVisible();
  56  |     
  57  |     // Check for Prefix filter
  58  |     const prefixSelect = page.getByLabel('Prefix', { exact: false });
  59  |     await expect(prefixSelect).toBeVisible();
  60  |     
  61  |     // Test search
  62  |     await searchInput.fill('JV-001');
  63  |     await searchInput.clear();
  64  |     
  65  |     // Test status filter
  66  |     await statusSelect.click();
  67  |     await page.getByRole('option', { name: 'Normal' }).click();
  68  |     
  69  |     // Test prefix filter
  70  |     await prefixSelect.click();
  71  |     await page.getByRole('option', { name: 'JV' }).click();
  72  |   });
  73  | 
  74  |   test('period date mode shows date pickers', async ({ page }) => {
  75  |     // Switch to Period Date mode
  76  |     const modeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /open period/i }).first();
  77  |     
  78  |     if (await modeSelect.isVisible().catch(() => false)) {
  79  |       await modeSelect.click();
  80  |       await page.getByRole('option', { name: 'Period Date' }).click();
  81  |       
  82  |       // Date pickers should appear
  83  |       const fromDate = page.getByPlaceholder('Start Date');
  84  |       const toDate = page.getByPlaceholder('End Date');
  85  |       
  86  |       if (await fromDate.isVisible().catch(() => false)) {
  87  |         await expect(fromDate).toBeVisible();
  88  |       }
  89  |       if (await toDate.isVisible().catch(() => false)) {
  90  |         await expect(toDate).toBeVisible();
  91  |       }
  92  |     }
  93  |   });
  94  | 
  95  |   test('view action navigates to detail page', async ({ page }) => {
  96  |     // Find first view button (eye icon)
  97  |     const viewButton = page.locator('[data-testid="view-action"], button[title="View"], button:has(.tabler-icon-eye)').first();
  98  |     
  99  |     if (await viewButton.isVisible().catch(() => false)) {
  100 |       await viewButton.click();
  101 |       await expect(page).toHaveURL(/.*gl\/journal-voucher\/\d+.*/);
  102 |     } else {
  103 |       test.skip();
  104 |     }
  105 |   });
  106 | 
  107 |   test('status badges display correctly', async ({ page }) => {
  108 |     // Check for status badges
  109 |     const normalBadge = page.locator('text=Normal');
  110 |     const voidBadge = page.locator('text=Void');
  111 |     
  112 |     const hasNormal = await normalBadge.first().isVisible().catch(() => false);
  113 |     const hasVoid = await voidBadge.first().isVisible().catch(() => false);
  114 |     
  115 |     // At least one type of badge might be visible
  116 |     if (hasNormal || hasVoid) {
  117 |       expect(true).toBe(true);
  118 |     }
  119 |   });
  120 | 
  121 |   test('pagination controls work', async ({ page }) => {
  122 |     const pagination = page.locator('.mantine-Pagination-root, [role="navigation"]').first();
  123 |     
  124 |     if (await pagination.isVisible().catch(() => false)) {
  125 |       const nextButton = pagination.locator('button').last();
  126 |       
  127 |       if (await nextButton.isEnabled().catch(() => false)) {
  128 |         await nextButton.click();
  129 |         await expect(page.getByText('Journal Vouchers')).toBeVisible();
  130 |       }
  131 |     }
  132 |   });
  133 | 
  134 |   test('page size selector works', async ({ page }) => {
  135 |     // Look for page size selector
  136 |     const pageSizeSelect = page.locator('select').filter({ hasText: /15|50|100/i }).first();
  137 |     
  138 |     if (await pageSizeSelect.isVisible().catch(() => false)) {
  139 |       await pageSizeSelect.click();
  140 |       await page.getByRole('option', { name: '50' }).click();
  141 |       
  142 |       // Page should still show vouchers
  143 |       await expect(page.getByText('Journal Vouchers')).toBeVisible();
  144 |     }
```
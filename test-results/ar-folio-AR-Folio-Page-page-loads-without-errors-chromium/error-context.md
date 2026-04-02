# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ar/folio.spec.ts >> AR Folio Page >> page loads without errors
- Location: tests/e2e/ar/folio.spec.ts:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('AR Folio')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('AR Folio')

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * AR Folio E2E Tests
  5  |  * Tests the Accounts Receivable Folio page functionality
  6  |  */
  7  | 
  8  | test.describe('AR Folio Page', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     // Navigate to AR Folio page (requires profileId query param)
  11 |     await page.goto('/ar/folio?profileId=1');
  12 |   });
  13 | 
  14 |   test('page loads without errors', async ({ page }) => {
  15 |     // Verify page title is visible
> 16 |     await expect(page.getByText('AR Folio')).toBeVisible();
     |                                              ^ Error: expect(locator).toBeVisible() failed
  17 |     
  18 |     // Verify the page header
  19 |     await expect(page.locator('text=AR Folio')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('displays folio data table', async ({ page }) => {
  23 |     // Wait for table to be visible
  24 |     await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
  25 |     
  26 |     // Check for column headers
  27 |     const headers = ['Date', 'Type', 'Document No.', 'Description', 'Debit', 'Credit', 'Balance'];
  28 |     for (const header of headers) {
  29 |       await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
  30 |     }
  31 |   });
  32 | 
  33 |   test('displays profile info section', async ({ page }) => {
  34 |     // Check for profile info elements
  35 |     await expect(page.getByText('Profile Code', { exact: false })).toBeVisible();
  36 |     await expect(page.getByText('Profile Name', { exact: false })).toBeVisible();
  37 |     await expect(page.getByText('Current Balance', { exact: false })).toBeVisible();
  38 |   });
  39 | 
  40 |   test('date filter controls are functional', async ({ page }) => {
  41 |     // Check for date inputs
  42 |     const fromDateInput = page.getByLabel('From Date', { exact: false });
  43 |     const toDateInput = page.getByLabel('To Date', { exact: false });
  44 |     
  45 |     await expect(fromDateInput).toBeVisible();
  46 |     await expect(toDateInput).toBeVisible();
  47 |     
  48 |     // Test setting date values
  49 |     await fromDateInput.fill('01/01/2024');
  50 |     await toDateInput.fill('31/12/2024');
  51 |   });
  52 | 
  53 |   test('back button navigates to profile page', async ({ page }) => {
  54 |     // Find and click back button
  55 |     const backButton = page.getByRole('button', { name: /back/i });
  56 |     await expect(backButton).toBeVisible();
  57 |     
  58 |     await backButton.click();
  59 |     
  60 |     // Verify navigation to profile page
  61 |     await expect(page).toHaveURL(/.*ar\/profile.*/);
  62 |   });
  63 | 
  64 |   test('displays totals section when data exists', async ({ page }) => {
  65 |     // Check for totals section labels
  66 |     const totalLabels = ['Total Debit', 'Total Credit'];
  67 |     for (const label of totalLabels) {
  68 |       // Use first() in case there are multiple matches
  69 |       const element = page.getByText(label, { exact: false }).first();
  70 |       await expect(element).toBeVisible();
  71 |     }
  72 |   });
  73 | 
  74 |   test('handles empty state gracefully', async ({ page }) => {
  75 |     // Check for empty state message
  76 |     const emptyMessage = page.getByText(/No folio transactions found|No data|Empty/i);
  77 |     
  78 |     // Empty state may or may not be visible depending on data
  79 |     // Just verify the page doesn't crash
  80 |     await expect(page.locator('body')).toBeVisible();
  81 |   });
  82 | 
  83 |   test('responsive layout on different viewports', async ({ page }) => {
  84 |     // Test mobile viewport
  85 |     await page.setViewportSize({ width: 375, height: 667 });
  86 |     await expect(page.getByText('AR Folio')).toBeVisible();
  87 |     
  88 |     // Test tablet viewport
  89 |     await page.setViewportSize({ width: 768, height: 1024 });
  90 |     await expect(page.getByText('AR Folio')).toBeVisible();
  91 |     
  92 |     // Reset to desktop
  93 |     await page.setViewportSize({ width: 1280, height: 720 });
  94 |   });
  95 | });
  96 | 
```
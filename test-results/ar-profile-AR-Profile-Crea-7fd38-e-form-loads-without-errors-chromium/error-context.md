# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ar/profile.spec.ts >> AR Profile Create Page >> create form loads without errors
- Location: tests/e2e/ar/profile.spec.ts:123:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/create|new/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/create|new/i)

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
  24  |     const headers = ['Code', 'Name', 'AR Type', 'Contact', 'Phone', 'Credit Limit', 'Currency', 'Status'];
  25  |     for (const header of headers) {
  26  |       await expect(page.getByText(header, { exact: false }).first()).toBeVisible();
  27  |     }
  28  |   });
  29  | 
  30  |   test('create button navigates to create page', async ({ page }) => {
  31  |     // Find create button
  32  |     const createButton = page.getByRole('button', { name: /create|new|add/i });
  33  |     await expect(createButton).toBeVisible();
  34  |     
  35  |     await createButton.click();
  36  |     
  37  |     // Verify navigation
  38  |     await expect(page).toHaveURL(/.*ar\/profile.*create.*/);
  39  |   });
  40  | 
  41  |   test('filter controls are functional', async ({ page }) => {
  42  |     // Check for AR Type filter
  43  |     const arTypeSelect = page.getByLabel('AR Type', { exact: false });
  44  |     await expect(arTypeSelect).toBeVisible();
  45  |     
  46  |     // Check for Status filter
  47  |     const statusSelect = page.getByLabel('Status', { exact: false });
  48  |     await expect(statusSelect).toBeVisible();
  49  |     
  50  |     // Check for Search input
  51  |     const searchInput = page.getByPlaceholder(/search/i);
  52  |     await expect(searchInput).toBeVisible();
  53  |     
  54  |     // Test filter interactions
  55  |     await arTypeSelect.click();
  56  |     await page.getByRole('option', { name: 'All Types' }).click();
  57  |     
  58  |     await statusSelect.click();
  59  |     await page.getByRole('option', { name: 'Active' }).click();
  60  |     
  61  |     await searchInput.fill('test');
  62  |     await searchInput.clear();
  63  |   });
  64  | 
  65  |   test('view action navigates to detail page', async ({ page }) => {
  66  |     // Find first view button (eye icon)
  67  |     const viewButton = page.locator('[data-testid="view-action"], button[title="View"], button:has(.tabler-icon-eye)').first();
  68  |     
  69  |     // Only test if there's data
  70  |     if (await viewButton.isVisible().catch(() => false)) {
  71  |       await viewButton.click();
  72  |       await expect(page).toHaveURL(/.*ar\/profile\/\d+.*/);
  73  |     } else {
  74  |       test.skip();
  75  |     }
  76  |   });
  77  | 
  78  |   test('edit action navigates to edit page', async ({ page }) => {
  79  |     // Find first edit button (edit icon)
  80  |     const editButton = page.locator('[data-testid="edit-action"], button[title="Edit"], button:has(.tabler-icon-edit)').first();
  81  |     
  82  |     // Only test if there's data
  83  |     if (await editButton.isVisible().catch(() => false)) {
  84  |       await editButton.click();
  85  |       await expect(page).toHaveURL(/.*ar\/profile\/\d+.*edit.*/);
  86  |     } else {
  87  |       test.skip();
  88  |     }
  89  |   });
  90  | 
  91  |   test('pagination controls work', async ({ page }) => {
  92  |     // Look for pagination controls
  93  |     const pagination = page.locator('.mantine-Pagination-root, [role="navigation"]').first();
  94  |     
  95  |     if (await pagination.isVisible().catch(() => false)) {
  96  |       // Try to go to next page if available
  97  |       const nextButton = pagination.locator('button').last();
  98  |       if (await nextButton.isEnabled().catch(() => false)) {
  99  |         await nextButton.click();
  100 |         // Page should still show AR Profile
  101 |         await expect(page.getByText('AR Profile')).toBeVisible();
  102 |       }
  103 |     }
  104 |   });
  105 | 
  106 |   test('responsive layout on mobile', async ({ page }) => {
  107 |     // Set mobile viewport
  108 |     await page.setViewportSize({ width: 375, height: 667 });
  109 |     
  110 |     // Page should still be accessible
  111 |     await expect(page.getByText('AR Profile')).toBeVisible();
  112 |     
  113 |     // Reset viewport
  114 |     await page.setViewportSize({ width: 1280, height: 720 });
  115 |   });
  116 | });
  117 | 
  118 | test.describe('AR Profile Create Page', () => {
  119 |   test.beforeEach(async ({ page }) => {
  120 |     await page.goto('/ar/profile/create');
  121 |   });
  122 | 
  123 |   test('create form loads without errors', async ({ page }) => {
> 124 |     await expect(page.getByText(/create|new/i)).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  125 |   });
  126 | 
  127 |   test('form has required fields', async ({ page }) => {
  128 |     // Check for form fields
  129 |     const formFields = ['Profile Code', 'Profile Name', 'AR Type', 'Currency'];
  130 |     for (const field of formFields) {
  131 |       const input = page.getByLabel(field, { exact: false }).first();
  132 |       await expect(input).toBeVisible();
  133 |     }
  134 |   });
  135 | 
  136 |   test('cancel button returns to list', async ({ page }) => {
  137 |     const cancelButton = page.getByRole('button', { name: /cancel/i });
  138 |     await expect(cancelButton).toBeVisible();
  139 |     
  140 |     await cancelButton.click();
  141 |     await expect(page).toHaveURL(/.*ar\/profile.*/);
  142 |   });
  143 | });
  144 | 
```
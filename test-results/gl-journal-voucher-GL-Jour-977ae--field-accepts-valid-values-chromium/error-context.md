# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gl/journal-voucher.spec.ts >> GL Journal Voucher Create Page >> prefix field accepts valid values
- Location: tests/e2e/gl/journal-voucher.spec.ts:204:3

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for getByLabel('Prefix')

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
  145 |   });
  146 | 
  147 |   test('handles empty state', async ({ page }) => {
  148 |     // Page should not crash even with no data
  149 |     await expect(page.locator('body')).toBeVisible();
  150 |     await expect(page.getByText('Journal Vouchers')).toBeVisible();
  151 |   });
  152 | 
  153 |   test('responsive layout', async ({ page }) => {
  154 |     // Mobile viewport
  155 |     await page.setViewportSize({ width: 375, height: 667 });
  156 |     await expect(page.getByText('Journal Vouchers')).toBeVisible();
  157 |     
  158 |     // Tablet
  159 |     await page.setViewportSize({ width: 768, height: 1024 });
  160 |     await expect(page.getByText('Journal Vouchers')).toBeVisible();
  161 |     
  162 |     // Reset
  163 |     await page.setViewportSize({ width: 1280, height: 720 });
  164 |   });
  165 | });
  166 | 
  167 | test.describe('GL Journal Voucher Create Page', () => {
  168 |   test.beforeEach(async ({ page }) => {
  169 |     await page.goto('/gl/journal-voucher/create');
  170 |   });
  171 | 
  172 |   test('create form loads without errors', async ({ page }) => {
  173 |     await expect(page.getByText(/create journal voucher/i)).toBeVisible();
  174 |   });
  175 | 
  176 |   test('form has required fields', async ({ page }) => {
  177 |     // Check for essential JV form fields
  178 |     const dateField = page.getByLabel('Date', { exact: false });
  179 |     const prefixField = page.getByLabel('Prefix', { exact: false });
  180 |     const descriptionField = page.getByLabel('Description', { exact: false });
  181 |     
  182 |     await expect(dateField).toBeVisible();
  183 |     await expect(prefixField).toBeVisible();
  184 |     await expect(descriptionField).toBeVisible();
  185 |   });
  186 | 
  187 |   test('form validation works', async ({ page }) => {
  188 |     // Try to submit without required fields
  189 |     const submitButton = page.getByRole('button', { name: /create|save|submit/i });
  190 |     await submitButton.click();
  191 |     
  192 |     // Should show validation error or stay on page
  193 |     await expect(page).toHaveURL(/.*gl\/journal-voucher.*create.*/);
  194 |   });
  195 | 
  196 |   test('cancel button returns to list', async ({ page }) => {
  197 |     const cancelButton = page.getByRole('button', { name: /cancel/i });
  198 |     await expect(cancelButton).toBeVisible();
  199 |     
  200 |     await cancelButton.click();
  201 |     await expect(page).toHaveURL(/.*gl\/journal-voucher.*/);
  202 |   });
  203 | 
  204 |   test('prefix field accepts valid values', async ({ page }) => {
  205 |     const prefixField = page.getByLabel('Prefix', { exact: false });
  206 |     
  207 |     // Clear and enter a prefix
> 208 |     await prefixField.fill('');
      |                       ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  209 |     await prefixField.fill('JV');
  210 |     
  211 |     // Should accept the value
  212 |     await expect(prefixField).toHaveValue('JV');
  213 |   });
  214 | 
  215 |   test('breadcrumbs are displayed', async ({ page }) => {
  216 |     // Check for breadcrumbs
  217 |     await expect(page.getByText('GL', { exact: false })).toBeVisible();
  218 |     await expect(page.getByText('Journal Vouchers', { exact: false })).toBeVisible();
  219 |     await expect(page.getByText('Create', { exact: false })).toBeVisible();
  220 |   });
  221 | });
  222 | 
  223 | test.describe('GL Journal Voucher Edit Page', () => {
  224 |   test('edit page loads for existing voucher', async ({ page }) => {
  225 |     // Navigate to an edit page with a test ID
  226 |     await page.goto('/gl/journal-voucher/1');
  227 |     
  228 |     // Page should load without errors
  229 |     await expect(page.locator('body')).toBeVisible();
  230 |   });
  231 | });
  232 | 
```
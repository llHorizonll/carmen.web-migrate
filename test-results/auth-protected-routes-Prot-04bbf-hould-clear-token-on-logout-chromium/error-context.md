# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/protected-routes.spec.ts >> Protected Routes - Logout Behavior >> should clear token on logout
- Location: tests/e2e/auth/protected-routes.spec.ts:477:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://localhost:5173/dashboard"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:5173/dashboard"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - paragraph [ref=e7]: Carmen Web
        - button "admin" [ref=e8] [cursor=pointer]:
          - generic [ref=e9]:
            - img [ref=e13]
            - paragraph [ref=e16]: admin
    - navigation [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - img [ref=e21]
            - paragraph [ref=e25]: General Ledger
          - generic [ref=e26]:
            - link "Journal Voucher" [ref=e27] [cursor=pointer]:
              - /url: /gl/journal-voucher
              - generic [ref=e28]: Journal Voucher
            - link "Allocation Voucher" [ref=e29] [cursor=pointer]:
              - /url: /gl/allocation-voucher
              - generic [ref=e30]: Allocation Voucher
            - link "Template Voucher" [ref=e31] [cursor=pointer]:
              - /url: /gl/template-voucher
              - generic [ref=e32]: Template Voucher
            - link "Recurring Voucher" [ref=e33] [cursor=pointer]:
              - /url: /gl/recurring-voucher
              - generic [ref=e34]: Recurring Voucher
            - link "Amortization Voucher" [ref=e35] [cursor=pointer]:
              - /url: /gl/amortization-voucher
              - generic [ref=e36]: Amortization Voucher
            - link "Account Summary" [ref=e37] [cursor=pointer]:
              - /url: /gl/account-summary
              - generic [ref=e38]: Account Summary
            - link "Financial Report" [ref=e39] [cursor=pointer]:
              - /url: /gl/financial-report
              - generic [ref=e40]: Financial Report
            - link "Chart of Accounts" [ref=e41] [cursor=pointer]:
              - /url: /gl/chart-of-accounts
              - generic [ref=e42]: Chart of Accounts
            - link "Budget" [ref=e43] [cursor=pointer]:
              - /url: /gl/budget
              - generic [ref=e44]: Budget
        - generic [ref=e45]:
          - generic [ref=e46]:
            - img [ref=e47]
            - paragraph [ref=e49]: Accounts Payable
          - generic [ref=e50]:
            - link "AP Vendor" [ref=e51] [cursor=pointer]:
              - /url: /ap/vendor
              - generic [ref=e52]: AP Vendor
            - link "AP Invoice" [ref=e53] [cursor=pointer]:
              - /url: /ap/invoice
              - generic [ref=e54]: AP Invoice
            - link "AP Payment" [ref=e55] [cursor=pointer]:
              - /url: /ap/payment
              - generic [ref=e56]: AP Payment
            - link "Procedures" [ref=e57] [cursor=pointer]:
              - /url: /ap/procedures
              - generic [ref=e58]: Procedures
        - generic [ref=e59]:
          - generic [ref=e60]:
            - img [ref=e61]
            - paragraph [ref=e67]: Accounts Receivable
          - generic [ref=e68]:
            - link "AR Profile" [ref=e69] [cursor=pointer]:
              - /url: /ar/profile
              - generic [ref=e70]: AR Profile
            - link "AR Folio" [ref=e71] [cursor=pointer]:
              - /url: /ar/folio
              - generic [ref=e72]: AR Folio
            - link "AR Invoice" [ref=e73] [cursor=pointer]:
              - /url: /ar/invoice
              - generic [ref=e74]: AR Invoice
            - link "AR Receipt" [ref=e75] [cursor=pointer]:
              - /url: /ar/receipt
              - generic [ref=e76]: AR Receipt
            - link "Procedures" [ref=e77] [cursor=pointer]:
              - /url: /ar/procedures
              - generic [ref=e78]: Procedures
        - generic [ref=e79]:
          - generic [ref=e80]:
            - img [ref=e81]
            - paragraph [ref=e85]: Asset Management
          - generic [ref=e86]:
            - link "Asset Register" [ref=e87] [cursor=pointer]:
              - /url: /asset/register
              - generic [ref=e88]: Asset Register
            - link "Pre-Asset" [ref=e89] [cursor=pointer]:
              - /url: /asset/pre-asset
              - generic [ref=e90]: Pre-Asset
            - link "Asset Disposal" [ref=e91] [cursor=pointer]:
              - /url: /asset/disposal
              - generic [ref=e92]: Asset Disposal
            - link "Asset Vendor" [ref=e93] [cursor=pointer]:
              - /url: /asset/vendor
              - generic [ref=e94]: Asset Vendor
            - link "Procedures" [ref=e95] [cursor=pointer]:
              - /url: /asset/procedures
              - generic [ref=e96]: Procedures
        - generic [ref=e97]:
          - generic [ref=e98]:
            - img [ref=e99]
            - paragraph [ref=e102]: Configuration
          - generic [ref=e103]:
            - link "Company" [ref=e104] [cursor=pointer]:
              - /url: /config/company
              - generic [ref=e105]: Company
            - link "Users" [ref=e106] [cursor=pointer]:
              - /url: /config/users
              - generic [ref=e107]: Users
            - link "Permissions" [ref=e108] [cursor=pointer]:
              - /url: /config/permissions
              - generic [ref=e109]: Permissions
            - link "Workflow" [ref=e110] [cursor=pointer]:
              - /url: /config/workflow
              - generic [ref=e111]: Workflow
            - link "Settings" [ref=e112] [cursor=pointer]:
              - /url: /config/settings
              - generic [ref=e113]: Settings
    - main [ref=e114]:
      - generic [ref=e115]: Dashboard
  - generic [ref=e116]:
    - img [ref=e118]
    - button "Open Tanstack query devtools" [ref=e166] [cursor=pointer]:
      - img [ref=e167]
```

# Test source

```ts
  394 |       // Should NOT be a 404 (check body is visible)
  395 |       await expect(page.locator('body')).toBeVisible();
  396 |       
  397 |       // Additional check: page should not contain 404 text
  398 |       const bodyText = await page.locator('body').textContent();
  399 |       expect(bodyText).not.toMatch(/404|not found|page not found/i);
  400 |     });
  401 |   }
  402 | });
  403 | 
  404 | test.describe('Protected Routes - Token Persistence', () => {
  405 |   test('should maintain authentication after page reload', async ({ page }) => {
  406 |     // Login first
  407 |     await page.goto('/login');
  408 |     await page.evaluate(() => {
  409 |       localStorage.clear();
  410 |       sessionStorage.clear();
  411 |     });
  412 |     await page.reload();
  413 |     await performLogin(page);
  414 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  415 |     
  416 |     // Navigate to a protected page
  417 |     await page.goto('/gl/journal-voucher');
  418 |     await expect(page).not.toHaveURL(/\/login/);
  419 |     
  420 |     // Reload the page
  421 |     await page.reload();
  422 |     
  423 |     // Should still be on the protected page (not redirected to login)
  424 |     await expect(page).not.toHaveURL(/\/login/);
  425 |     await expect(page.locator('body')).toBeVisible();
  426 |   });
  427 | 
  428 |   test('should maintain authentication across multiple tabs', async ({ browser }) => {
  429 |     // Create a new context (simulates separate session)
  430 |     const context = await browser.newContext();
  431 |     const page1 = await context.newPage();
  432 |     
  433 |     // Login in first tab
  434 |     await page1.goto('/login');
  435 |     await performLogin(page1);
  436 |     await page1.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  437 |     
  438 |     // Open new tab in same context
  439 |     const page2 = await context.newPage();
  440 |     await page2.goto('/gl/journal-voucher');
  441 |     
  442 |     // Second tab should be authenticated
  443 |     await expect(page2).not.toHaveURL(/\/login/);
  444 |     await expect(page2.locator('body')).toBeVisible();
  445 |     
  446 |     await context.close();
  447 |   });
  448 | });
  449 | 
  450 | test.describe('Protected Routes - Logout Behavior', () => {
  451 |   test.beforeEach(async ({ page }) => {
  452 |     // Login before each test
  453 |     await page.goto('/login');
  454 |     await page.evaluate(() => {
  455 |       localStorage.clear();
  456 |       sessionStorage.clear();
  457 |     });
  458 |     await page.reload();
  459 |     await performLogin(page);
  460 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  461 |   });
  462 | 
  463 |   test('should redirect to login after logout', async ({ page }) => {
  464 |     // Clear token (simulate logout since logout UI might not be implemented)
  465 |     await page.evaluate(() => {
  466 |       localStorage.removeItem('AccessToken');
  467 |       localStorage.removeItem('RefreshToken');
  468 |     });
  469 |     
  470 |     // Navigate to a protected page
  471 |     await page.goto('/gl/journal-voucher');
  472 |     
  473 |     // Should be redirected to login
  474 |     await expect(page).toHaveURL(/\/login/);
  475 |   });
  476 | 
  477 |   test('should clear token on logout', async ({ page }) => {
  478 |     // Verify token exists
  479 |     let token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  480 |     expect(token).toBeTruthy();
  481 |     
  482 |     // Clear token (simulate logout)
  483 |     await page.evaluate(() => {
  484 |       localStorage.removeItem('AccessToken');
  485 |       localStorage.removeItem('RefreshToken');
  486 |     });
  487 |     
  488 |     // Token should be gone
  489 |     token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  490 |     expect(token).toBeFalsy();
  491 |     
  492 |     // Try to access protected page
  493 |     await page.goto('/dashboard');
> 494 |     await expect(page).toHaveURL(/\/login/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  495 |   });
  496 | });
  497 | 
```
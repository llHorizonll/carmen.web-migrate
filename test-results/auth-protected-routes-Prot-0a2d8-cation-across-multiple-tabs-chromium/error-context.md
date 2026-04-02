# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/protected-routes.spec.ts >> Protected Routes - Token Persistence >> should maintain authentication across multiple tabs
- Location: tests/e2e/auth/protected-routes.spec.ts:428:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Next' })
    - locator resolved to <button type="submit" data-size="sm" class="mantine-focus-auto mantine-active m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - element is not visible
  - retrying click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Protected Routes Authentication Tests
  5   |  * 
  6   |  * These tests verify:
  7   |  * - Accessing protected pages without login redirects to login
  8   |  * - After login, user is redirected back to original page
  9   |  * - Authenticated users can access protected pages
  10  |  * - All module routes are properly protected
  11  |  */
  12  | 
  13  | // All protected routes that need to be tested (from the task requirements)
  14  | const PROTECTED_ROUTES = [
  15  |   // General Ledger
  16  |   { path: '/gl/journal-voucher', name: 'GL Journal Voucher' },
  17  |   { path: '/gl/allocation-voucher', name: 'GL Allocation Voucher' },
  18  |   { path: '/gl/template-voucher', name: 'GL Template Voucher' },
  19  |   { path: '/gl/recurring-voucher', name: 'GL Recurring Voucher' },
  20  |   { path: '/gl/amortization-voucher', name: 'GL Amortization Voucher' },
  21  |   { path: '/gl/account-summary', name: 'GL Account Summary' },
  22  |   { path: '/gl/financial-report', name: 'GL Financial Report' },
  23  |   { path: '/gl/chart-of-accounts', name: 'GL Chart of Accounts' },
  24  |   { path: '/gl/budget', name: 'GL Budget' },
  25  |   // Accounts Payable
  26  |   { path: '/ap/vendor', name: 'AP Vendor' },
  27  |   { path: '/ap/invoice', name: 'AP Invoice' },
  28  |   { path: '/ap/payment', name: 'AP Payment' },
  29  |   // Accounts Receivable
  30  |   { path: '/ar/profile', name: 'AR Profile' },
  31  |   { path: '/ar/folio', name: 'AR Folio' },
  32  |   { path: '/ar/invoice', name: 'AR Invoice' },
  33  |   { path: '/ar/receipt', name: 'AR Receipt' },
  34  |   // Asset
  35  |   { path: '/asset/register', name: 'Asset Register' },
  36  |   { path: '/asset/pre-asset', name: 'Asset Pre-Asset' },
  37  |   { path: '/asset/disposal', name: 'Asset Disposal' },
  38  |   // Configuration
  39  |   { path: '/config/company', name: 'Config Company' },
  40  |   { path: '/config/users', name: 'Config Users' },
  41  | ];
  42  | 
  43  | // Routes that exist in pages but not yet in router (skip redirect tests for these)
  44  | const FUTURE_ROUTES = [
  45  |   '/ar/folio',
  46  |   '/ar/invoice',
  47  |   '/ar/invoice/new',
  48  |   '/ar/receipt',
  49  |   '/ar/receipt/new',
  50  |   '/ar/profile',
  51  |   '/ar/profile/new',
  52  |   '/ap/invoice',
  53  |   '/ap/invoice/new',
  54  |   '/ap/payment',
  55  |   '/ap/payment/new',
  56  |   '/ap/vendor',
  57  |   '/ap/vendor/new',
  58  |   '/asset',
  59  | ];
  60  | 
  61  | // Helper function to perform complete login with 2-step flow
  62  | async function performLogin(page: any, username: string = 'admin', password: string = 'alpha') {
  63  |   // Step 1: Enter username and click Next
  64  |   await page.getByPlaceholder('Enter your username').fill(username);
> 65  |   await page.getByRole('button', { name: 'Next' }).click();
      |                                                    ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  66  |   
  67  |   // Wait for step 2 UI to appear
  68  |   await expect(page.getByPlaceholder('Enter your password')).toBeVisible({ timeout: 15000 });
  69  |   
  70  |   // Step 2: Enter password and click Sign In
  71  |   await page.getByPlaceholder('Enter your password').fill(password);
  72  |   await page.getByRole('button', { name: 'Sign In' }).click();
  73  | }
  74  | 
  75  | test.describe('Protected Routes - Redirect to Login', () => {
  76  |   test.beforeEach(async ({ page }) => {
  77  |     // Navigate first, then clear storage
  78  |     await page.goto('/login');
  79  |     await page.evaluate(() => {
  80  |       localStorage.clear();
  81  |       sessionStorage.clear();
  82  |     });
  83  |     await page.reload();
  84  |   });
  85  | 
  86  |   test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
  87  |     await page.goto('/dashboard');
  88  |     
  89  |     // Should be redirected to login page
  90  |     await expect(page).toHaveURL(/\/login/);
  91  |     
  92  |     // Login form should be visible
  93  |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  94  |     await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  95  |   });
  96  | 
  97  |   test('should redirect to login when accessing GL journal voucher without auth', async ({ page }) => {
  98  |     await page.goto('/gl/journal-voucher');
  99  |     
  100 |     // Should be redirected to login page
  101 |     await expect(page).toHaveURL(/\/login/);
  102 |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  103 |   });
  104 | 
  105 |   test('should preserve redirect URL in state', async ({ page }) => {
  106 |     const targetPath = '/gl/journal-voucher';
  107 |     await page.goto(targetPath);
  108 |     
  109 |     // Should be redirected to login
  110 |     await expect(page).toHaveURL(/\/login/);
  111 |     
  112 |     // Check if the original URL is preserved in history state
  113 |     const fromState = await page.evaluate(() => {
  114 |       return window.history.state?.usr?.from?.pathname;
  115 |     });
  116 |     
  117 |     expect(fromState).toBe(targetPath);
  118 |   });
  119 | });
  120 | 
  121 | test.describe('Protected Routes - Redirect After Login', () => {
  122 |   test.beforeEach(async ({ page }) => {
  123 |     await page.goto('/login');
  124 |     await page.evaluate(() => {
  125 |       localStorage.clear();
  126 |       sessionStorage.clear();
  127 |     });
  128 |     await page.reload();
  129 |   });
  130 | 
  131 |   test('should redirect back to GL journal voucher after successful login', async ({ page }) => {
  132 |     // Try to access protected page
  133 |     await page.goto('/gl/journal-voucher');
  134 |     
  135 |     // Should be on login page
  136 |     await expect(page).toHaveURL(/\/login/);
  137 |     
  138 |     // Login with two-step flow
  139 |     await performLogin(page);
  140 |     
  141 |     // Should redirect to originally requested page
  142 |     await page.waitForURL(/\/gl\/journal-voucher/, { timeout: 15000 });
  143 |     await expect(page).toHaveURL(/\/gl\/journal-voucher/);
  144 |     
  145 |     // Verify the page loaded correctly
  146 |     await expect(page.locator('body')).toBeVisible();
  147 |   });
  148 | 
  149 |   test('should redirect back to dashboard after successful login', async ({ page }) => {
  150 |     // Try to access protected page
  151 |     await page.goto('/dashboard');
  152 |     
  153 |     // Should be on login page
  154 |     await expect(page).toHaveURL(/\/login/);
  155 |     
  156 |     // Login
  157 |     await performLogin(page);
  158 |     
  159 |     // Should redirect to dashboard
  160 |     await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  161 |     await expect(page).toHaveURL(/\/dashboard/);
  162 |     
  163 |     // Verify dashboard content
  164 |     await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  165 |   });
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/protected-routes.spec.ts >> Protected Routes - Authenticated Access >> should access AR invoice list when authenticated
- Location: tests/e2e/auth/protected-routes.spec.ts:197:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('input[type="password"]') to be visible

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
        - button "Next" [active] [ref=e26] [cursor=pointer]:
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
  4   |  * Protected Routes Authentication Tests
  5   |  * 
  6   |  * These tests verify:
  7   |  * - Accessing protected pages without login redirects to login
  8   |  * - After login, user is redirected back to original page
  9   |  * - Authenticated users can access protected pages
  10  |  * - All module routes are properly protected
  11  |  */
  12  | 
  13  | // List of protected routes to test
  14  | const PROTECTED_ROUTES = [
  15  |   { path: '/dashboard', name: 'Dashboard' },
  16  |   { path: '/ar/folio', name: 'AR Folio' },
  17  |   { path: '/ar/invoice', name: 'AR Invoice List' },
  18  |   { path: '/ar/invoice/new', name: 'AR Invoice Create' },
  19  |   { path: '/ar/receipt', name: 'AR Receipt List' },
  20  |   { path: '/ar/receipt/new', name: 'AR Receipt Create' },
  21  |   { path: '/ar/profile', name: 'AR Profile List' },
  22  |   { path: '/ar/profile/new', name: 'AR Profile Create' },
  23  |   { path: '/ap/invoice', name: 'AP Invoice List' },
  24  |   { path: '/ap/invoice/new', name: 'AP Invoice Create' },
  25  |   { path: '/ap/payment', name: 'AP Payment List' },
  26  |   { path: '/ap/payment/new', name: 'AP Payment Create' },
  27  |   { path: '/ap/vendor', name: 'AP Vendor List' },
  28  |   { path: '/ap/vendor/new', name: 'AP Vendor Create' },
  29  |   { path: '/gl/journal-voucher', name: 'GL Journal Voucher List' },
  30  |   { path: '/gl/journal-voucher/new', name: 'GL Journal Voucher Create' },
  31  |   { path: '/gl/allocation-voucher', name: 'GL Allocation Voucher List' },
  32  |   { path: '/gl/allocation-voucher/new', name: 'GL Allocation Voucher Create' },
  33  |   { path: '/gl/amortization-voucher', name: 'GL Amortization Voucher List' },
  34  |   { path: '/gl/amortization-voucher/new', name: 'GL Amortization Voucher Create' },
  35  |   { path: '/gl/standard-voucher', name: 'GL Standard Voucher List' },
  36  |   { path: '/gl/standard-voucher/new', name: 'GL Standard Voucher Create' },
  37  |   { path: '/asset', name: 'Asset List' },
  38  | ];
  39  | 
  40  | // Helper function to perform complete login
  41  | async function performLogin(page: any, username: string = 'admin', password: string = 'alpha') {
  42  |   // Step 1: Enter username and click Next
  43  |   await page.getByPlaceholder('Enter your username').fill(username);
  44  |   await page.getByRole('button', { name: 'Next' }).click();
  45  |   
  46  |   // Wait for password field to appear
> 47  |   await page.waitForSelector('input[type="password"]', { timeout: 5000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  48  |   
  49  |   // Step 2: Enter password and click Sign In
  50  |   await page.getByPlaceholder('Enter your password').fill(password);
  51  |   await page.getByRole('button', { name: 'Sign In' }).click();
  52  | }
  53  | 
  54  | test.describe('Protected Routes - Redirect to Login', () => {
  55  |   test.beforeEach(async ({ page }) => {
  56  |     // Navigate first, then clear storage
  57  |     await page.goto('/login');
  58  |     await page.evaluate(() => {
  59  |       localStorage.clear();
  60  |       sessionStorage.clear();
  61  |     });
  62  |     await page.reload();
  63  |   });
  64  | 
  65  |   test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
  66  |     await page.goto('/dashboard');
  67  |     
  68  |     // Should be redirected to login page
  69  |     await expect(page).toHaveURL(/\/login/);
  70  |     
  71  |     // Login form should be visible
  72  |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  73  |     await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  74  |   });
  75  | 
  76  |   test('should redirect to login when accessing AR folio without auth', async ({ page }) => {
  77  |     await page.goto('/ar/folio');
  78  |     
  79  |     // Should be redirected to login page
  80  |     await expect(page).toHaveURL(/\/login/);
  81  |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  82  |   });
  83  | 
  84  |   test('should preserve redirect URL in state', async ({ page }) => {
  85  |     const targetPath = '/ar/folio';
  86  |     await page.goto(targetPath);
  87  |     
  88  |     // Check if the original URL is preserved in sessionStorage
  89  |     const storedRedirect = await page.evaluate(() => {
  90  |       return sessionStorage.getItem('redirectAfterLogin') || 
  91  |              localStorage.getItem('redirectAfterLogin');
  92  |     });
  93  |     
  94  |     expect(storedRedirect).toBeTruthy();
  95  |     expect(storedRedirect).toContain('/ar/folio');
  96  |   });
  97  | });
  98  | 
  99  | test.describe('Protected Routes - Redirect After Login', () => {
  100 |   test.beforeEach(async ({ page }) => {
  101 |     await page.goto('/login');
  102 |     await page.evaluate(() => {
  103 |       localStorage.clear();
  104 |       sessionStorage.clear();
  105 |     });
  106 |     await page.reload();
  107 |   });
  108 | 
  109 |   test('should redirect back to AR folio after successful login', async ({ page }) => {
  110 |     // Try to access protected page
  111 |     await page.goto('/ar/folio');
  112 |     
  113 |     // Should be on login page
  114 |     await expect(page).toHaveURL(/\/login/);
  115 |     
  116 |     // Login with two-step flow
  117 |     await performLogin(page);
  118 |     
  119 |     // Should redirect to originally requested page
  120 |     await page.waitForURL(/\/ar\/folio/, { timeout: 10000 });
  121 |     await expect(page).toHaveURL(/\/ar\/folio/);
  122 |     
  123 |     // Verify the page loaded correctly
  124 |     await expect(page.locator('body')).toBeVisible();
  125 |   });
  126 | 
  127 |   test('should redirect back to dashboard after successful login', async ({ page }) => {
  128 |     // Try to access protected page
  129 |     await page.goto('/dashboard');
  130 |     
  131 |     // Should be on login page
  132 |     await expect(page).toHaveURL(/\/login/);
  133 |     
  134 |     // Login
  135 |     await performLogin(page);
  136 |     
  137 |     // Should redirect to dashboard
  138 |     await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  139 |     await expect(page).toHaveURL(/\/dashboard/);
  140 |     
  141 |     // Verify dashboard content
  142 |     await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  143 |   });
  144 | 
  145 |   test('should redirect back to GL journal voucher page after login', async ({ page }) => {
  146 |     const targetPath = '/gl/journal-voucher';
  147 |     await page.goto(targetPath);
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/protected-routes.spec.ts >> Protected Routes - Token Persistence >> should maintain authentication across multiple tabs
- Location: tests/e2e/auth/protected-routes.spec.ts:276:3

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/login/
Received string: "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "not toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:5173/login"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - paragraph [ref=e7]: Carmen Web
        - button "Administrator" [ref=e8] [cursor=pointer]:
          - generic [ref=e9]:
            - img [ref=e13]
            - paragraph [ref=e16]: Administrator
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
  191 | 
  192 |   test('should access GL journal voucher list when authenticated', async ({ page }) => {
  193 |     await page.goto('/gl/journal-voucher');
  194 |     
  195 |     // Should NOT redirect to login
  196 |     await expect(page).not.toHaveURL(/\/login/);
  197 |     
  198 |     // Page should be accessible
  199 |     await expect(page.locator('body')).toBeVisible();
  200 |   });
  201 | 
  202 |   test('should access GL journal voucher create page when authenticated', async ({ page }) => {
  203 |     await page.goto('/gl/journal-voucher/new');
  204 |     
  205 |     await expect(page).not.toHaveURL(/\/login/);
  206 |     await expect(page.locator('body')).toBeVisible();
  207 |   });
  208 | 
  209 |   test('should access GL allocation voucher list when authenticated', async ({ page }) => {
  210 |     await page.goto('/gl/allocation-voucher');
  211 |     
  212 |     await expect(page).not.toHaveURL(/\/login/);
  213 |     await expect(page.locator('body')).toBeVisible();
  214 |   });
  215 | 
  216 |   test('should access GL amortization voucher list when authenticated', async ({ page }) => {
  217 |     await page.goto('/gl/amortization-voucher');
  218 |     
  219 |     await expect(page).not.toHaveURL(/\/login/);
  220 |     await expect(page.locator('body')).toBeVisible();
  221 |   });
  222 | 
  223 |   test('should access GL standard voucher list when authenticated', async ({ page }) => {
  224 |     await page.goto('/gl/standard-voucher');
  225 |     
  226 |     await expect(page).not.toHaveURL(/\/login/);
  227 |     await expect(page.locator('body')).toBeVisible();
  228 |   });
  229 | });
  230 | 
  231 | test.describe('Protected Routes - All Routes Coverage', () => {
  232 |   test.beforeEach(async ({ page }) => {
  233 |     await page.goto('/login');
  234 |     await page.evaluate(() => {
  235 |       localStorage.clear();
  236 |       sessionStorage.clear();
  237 |     });
  238 |     await page.reload();
  239 |   });
  240 | 
  241 |   // Test that all protected routes require authentication
  242 |   for (const route of PROTECTED_ROUTES) {
  243 |     test(`should require auth for ${route.name} (${route.path})`, async ({ page }) => {
  244 |       await page.goto(route.path);
  245 |       
  246 |       // Without auth, should redirect to login
  247 |       await expect(page).toHaveURL(/\/login/);
  248 |     });
  249 |   }
  250 | });
  251 | 
  252 | test.describe('Protected Routes - Token Persistence', () => {
  253 |   test('should maintain authentication after page reload', async ({ page }) => {
  254 |     // Login first
  255 |     await page.goto('/login');
  256 |     await page.evaluate(() => {
  257 |       localStorage.clear();
  258 |       sessionStorage.clear();
  259 |     });
  260 |     await page.reload();
  261 |     await performLogin(page);
  262 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  263 |     
  264 |     // Navigate to a protected page
  265 |     await page.goto('/gl/journal-voucher');
  266 |     await expect(page).not.toHaveURL(/\/login/);
  267 |     
  268 |     // Reload the page
  269 |     await page.reload();
  270 |     
  271 |     // Should still be on the protected page (not redirected to login)
  272 |     await expect(page).not.toHaveURL(/\/login/);
  273 |     await expect(page.locator('body')).toBeVisible();
  274 |   });
  275 | 
  276 |   test('should maintain authentication across multiple tabs', async ({ browser }) => {
  277 |     // Create a new context (simulates separate session)
  278 |     const context = await browser.newContext();
  279 |     const page1 = await context.newPage();
  280 |     
  281 |     // Login in first tab
  282 |     await page1.goto('/login');
  283 |     await performLogin(page1);
  284 |     await page1.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  285 |     
  286 |     // Open new tab in same context
  287 |     const page2 = await context.newPage();
  288 |     await page2.goto('/gl/journal-voucher');
  289 |     
  290 |     // Second tab should be authenticated
> 291 |     await expect(page2).not.toHaveURL(/\/login/);
      |                             ^ Error: expect(page).not.toHaveURL(expected) failed
  292 |     await expect(page2.locator('body')).toBeVisible();
  293 |     
  294 |     await context.close();
  295 |   });
  296 | });
  297 | 
  298 | test.describe('Protected Routes - Logout Behavior', () => {
  299 |   test.beforeEach(async ({ page }) => {
  300 |     // Login before each test
  301 |     await page.goto('/login');
  302 |     await page.evaluate(() => {
  303 |       localStorage.clear();
  304 |       sessionStorage.clear();
  305 |     });
  306 |     await page.reload();
  307 |     await performLogin(page);
  308 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  309 |   });
  310 | 
  311 |   test('should redirect to login after logout', async ({ page }) => {
  312 |     // Clear token (simulate logout since logout UI might not be implemented)
  313 |     await page.evaluate(() => {
  314 |       localStorage.removeItem('AccessToken');
  315 |       localStorage.removeItem('RefreshToken');
  316 |     });
  317 |     
  318 |     // Navigate to a protected page
  319 |     await page.goto('/gl/journal-voucher');
  320 |     
  321 |     // Should be redirected to login
  322 |     await expect(page).toHaveURL(/\/login/);
  323 |   });
  324 | 
  325 |   test('should clear token on logout', async ({ page }) => {
  326 |     // Verify token exists
  327 |     let token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  328 |     expect(token).toBeTruthy();
  329 |     
  330 |     // Clear token (simulate logout)
  331 |     await page.evaluate(() => {
  332 |       localStorage.removeItem('AccessToken');
  333 |       localStorage.removeItem('RefreshToken');
  334 |     });
  335 |     
  336 |     // Token should be gone
  337 |     token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  338 |     expect(token).toBeFalsy();
  339 |     
  340 |     // Try to access protected page
  341 |     await page.goto('/dashboard');
  342 |     await expect(page).toHaveURL(/\/login/);
  343 |   });
  344 | });
  345 | 
```
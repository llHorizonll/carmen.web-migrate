# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/protected-routes.spec.ts >> Protected Routes - Authenticated Access >> should access GL amortization voucher list when authenticated
- Location: tests/e2e/auth/protected-routes.spec.ts:216:3

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/login/
Received string: "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "not toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:5173/login"

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
  119 |     await expect(page).toHaveURL(/\/login/);
  120 |     
  121 |     // Login with two-step flow
  122 |     await performLogin(page);
  123 |     
  124 |     // Should redirect to originally requested page
  125 |     await page.waitForURL(/\/gl\/journal-voucher/, { timeout: 15000 });
  126 |     await expect(page).toHaveURL(/\/gl\/journal-voucher/);
  127 |     
  128 |     // Verify the page loaded correctly
  129 |     await expect(page.locator('body')).toBeVisible();
  130 |   });
  131 | 
  132 |   test('should redirect back to dashboard after successful login', async ({ page }) => {
  133 |     // Try to access protected page
  134 |     await page.goto('/dashboard');
  135 |     
  136 |     // Should be on login page
  137 |     await expect(page).toHaveURL(/\/login/);
  138 |     
  139 |     // Login
  140 |     await performLogin(page);
  141 |     
  142 |     // Should redirect to dashboard
  143 |     await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  144 |     await expect(page).toHaveURL(/\/dashboard/);
  145 |     
  146 |     // Verify dashboard content
  147 |     await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  148 |   });
  149 | 
  150 |   test('should redirect back to GL allocation voucher page after login', async ({ page }) => {
  151 |     const targetPath = '/gl/allocation-voucher';
  152 |     await page.goto(targetPath);
  153 |     
  154 |     // Should be redirected to login
  155 |     await expect(page).toHaveURL(/\/login/);
  156 |     
  157 |     // Login
  158 |     await performLogin(page);
  159 |     
  160 |     // Should redirect back to GL allocation voucher
  161 |     await page.waitForURL(/\/gl\/allocation-voucher/, { timeout: 15000 });
  162 |     await expect(page).toHaveURL(/\/gl\/allocation-voucher/);
  163 |   });
  164 | });
  165 | 
  166 | test.describe('Protected Routes - Authenticated Access', () => {
  167 |   test.beforeEach(async ({ page }) => {
  168 |     // Login before each test
  169 |     await page.goto('/login');
  170 |     await page.evaluate(() => {
  171 |       localStorage.clear();
  172 |       sessionStorage.clear();
  173 |     });
  174 |     await page.reload();
  175 |     await performLogin(page);
  176 |     
  177 |     // Wait for navigation to complete
  178 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  179 |   });
  180 | 
  181 |   test('should access dashboard when authenticated', async ({ page }) => {
  182 |     await page.goto('/dashboard');
  183 |     
  184 |     // Should NOT redirect to login
  185 |     await expect(page).not.toHaveURL(/\/login/);
  186 |     
  187 |     // Page should be accessible
  188 |     await expect(page.locator('body')).toBeVisible();
  189 |     await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  190 |   });
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
> 219 |     await expect(page).not.toHaveURL(/\/login/);
      |                            ^ Error: expect(page).not.toHaveURL(expected) failed
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
  291 |     await expect(page2).not.toHaveURL(/\/login/);
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
```
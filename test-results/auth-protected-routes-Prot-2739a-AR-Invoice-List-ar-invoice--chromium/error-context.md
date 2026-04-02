# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/protected-routes.spec.ts >> Protected Routes - All Routes Coverage >> should require auth for AR Invoice List (/ar/invoice)
- Location: tests/e2e/auth/protected-routes.spec.ts:256:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://localhost:5173/ar/invoice"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:5173/ar/invoice"

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
  160 | 
  161 | test.describe('Protected Routes - Authenticated Access', () => {
  162 |   test.beforeEach(async ({ page }) => {
  163 |     // Login before each test
  164 |     await page.goto('/login');
  165 |     await page.evaluate(() => {
  166 |       localStorage.clear();
  167 |       sessionStorage.clear();
  168 |     });
  169 |     await page.reload();
  170 |     await performLogin(page);
  171 |     
  172 |     // Wait for navigation to complete
  173 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  174 |   });
  175 | 
  176 |   test('should access dashboard when authenticated', async ({ page }) => {
  177 |     await page.goto('/dashboard');
  178 |     
  179 |     // Should NOT redirect to login
  180 |     await expect(page).not.toHaveURL(/\/login/);
  181 |     
  182 |     // Page should be accessible
  183 |     await expect(page.locator('body')).toBeVisible();
  184 |     await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  185 |   });
  186 | 
  187 |   test('should access AR folio when authenticated', async ({ page }) => {
  188 |     await page.goto('/ar/folio');
  189 |     
  190 |     // Should NOT redirect to login
  191 |     await expect(page).not.toHaveURL(/\/login/);
  192 |     
  193 |     // Page should be accessible
  194 |     await expect(page.locator('body')).toBeVisible();
  195 |   });
  196 | 
  197 |   test('should access AR invoice list when authenticated', async ({ page }) => {
  198 |     await page.goto('/ar/invoice');
  199 |     
  200 |     await expect(page).not.toHaveURL(/\/login/);
  201 |     await expect(page.locator('body')).toBeVisible();
  202 |   });
  203 | 
  204 |   test('should access AR invoice create page when authenticated', async ({ page }) => {
  205 |     await page.goto('/ar/invoice/new');
  206 |     
  207 |     await expect(page).not.toHaveURL(/\/login/);
  208 |     await expect(page.locator('body')).toBeVisible();
  209 |   });
  210 | 
  211 |   test('should access GL journal voucher list when authenticated', async ({ page }) => {
  212 |     await page.goto('/gl/journal-voucher');
  213 |     
  214 |     await expect(page).not.toHaveURL(/\/login/);
  215 |     await expect(page.locator('body')).toBeVisible();
  216 |   });
  217 | 
  218 |   test('should access GL journal voucher create page when authenticated', async ({ page }) => {
  219 |     await page.goto('/gl/journal-voucher/new');
  220 |     
  221 |     await expect(page).not.toHaveURL(/\/login/);
  222 |     await expect(page.locator('body')).toBeVisible();
  223 |   });
  224 | 
  225 |   test('should access AP modules when authenticated', async ({ page }) => {
  226 |     await page.goto('/ap/invoice');
  227 |     await expect(page).not.toHaveURL(/\/login/);
  228 |     
  229 |     await page.goto('/ap/payment');
  230 |     await expect(page).not.toHaveURL(/\/login/);
  231 |     
  232 |     await page.goto('/ap/vendor');
  233 |     await expect(page).not.toHaveURL(/\/login/);
  234 |   });
  235 | 
  236 |   test('should access Asset module when authenticated', async ({ page }) => {
  237 |     await page.goto('/asset');
  238 |     
  239 |     await expect(page).not.toHaveURL(/\/login/);
  240 |     await expect(page.locator('body')).toBeVisible();
  241 |   });
  242 | });
  243 | 
  244 | test.describe('Protected Routes - All Routes Coverage', () => {
  245 |   test.beforeEach(async ({ page }) => {
  246 |     await page.goto('/login');
  247 |     await page.evaluate(() => {
  248 |       localStorage.clear();
  249 |       sessionStorage.clear();
  250 |     });
  251 |     await page.reload();
  252 |   });
  253 | 
  254 |   // Test that all protected routes require authentication
  255 |   for (const route of PROTECTED_ROUTES) {
  256 |     test(`should require auth for ${route.name} (${route.path})`, async ({ page }) => {
  257 |       await page.goto(route.path);
  258 |       
  259 |       // Without auth, should redirect to login
> 260 |       await expect(page).toHaveURL(/\/login/);
      |                          ^ Error: expect(page).toHaveURL(expected) failed
  261 |     });
  262 |   }
  263 | });
  264 | 
  265 | test.describe('Protected Routes - Token Persistence', () => {
  266 |   test('should maintain authentication after page reload', async ({ page }) => {
  267 |     // Login first
  268 |     await page.goto('/login');
  269 |     await page.evaluate(() => {
  270 |       localStorage.clear();
  271 |       sessionStorage.clear();
  272 |     });
  273 |     await page.reload();
  274 |     await performLogin(page);
  275 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  276 |     
  277 |     // Navigate to a protected page
  278 |     await page.goto('/ar/folio');
  279 |     await expect(page).not.toHaveURL(/\/login/);
  280 |     
  281 |     // Reload the page
  282 |     await page.reload();
  283 |     
  284 |     // Should still be on the protected page (not redirected to login)
  285 |     await expect(page).not.toHaveURL(/\/login/);
  286 |     await expect(page.locator('body')).toBeVisible();
  287 |   });
  288 | 
  289 |   test('should maintain authentication across multiple tabs', async ({ browser }) => {
  290 |     // Create a new context (simulates separate session)
  291 |     const context = await browser.newContext();
  292 |     const page1 = await context.newPage();
  293 |     
  294 |     // Login in first tab
  295 |     await page1.goto('/login');
  296 |     await performLogin(page1);
  297 |     await page1.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  298 |     
  299 |     // Open new tab in same context
  300 |     const page2 = await context.newPage();
  301 |     await page2.goto('/ar/folio');
  302 |     
  303 |     // Second tab should be authenticated
  304 |     await expect(page2).not.toHaveURL(/\/login/);
  305 |     await expect(page2.locator('body')).toBeVisible();
  306 |     
  307 |     await context.close();
  308 |   });
  309 | });
  310 | 
  311 | test.describe('Protected Routes - Logout Behavior', () => {
  312 |   test.beforeEach(async ({ page }) => {
  313 |     // Login before each test
  314 |     await page.goto('/login');
  315 |     await page.evaluate(() => {
  316 |       localStorage.clear();
  317 |       sessionStorage.clear();
  318 |     });
  319 |     await page.reload();
  320 |     await performLogin(page);
  321 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  322 |   });
  323 | 
  324 |   test('should redirect to login after logout', async ({ page }) => {
  325 |     // Find and click logout button/link in the UserMenu
  326 |     const userMenuButton = page.locator('button').filter({ has: page.locator('[data-icon="user"], .mantine-Avatar-root') }).first();
  327 |     const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  328 |     
  329 |     // If logout button is directly visible, click it
  330 |     if (await logoutButton.isVisible().catch(() => false)) {
  331 |       await logoutButton.click();
  332 |     } else if (await userMenuButton.isVisible().catch(() => false)) {
  333 |       // Open user menu first
  334 |       await userMenuButton.click();
  335 |       // Then click logout
  336 |       await page.getByRole('menuitem', { name: /logout|sign out/i }).click();
  337 |     } else {
  338 |       // Manually clear auth if logout button not found
  339 |       await page.evaluate(() => {
  340 |         localStorage.removeItem('AccessToken');
  341 |       });
  342 |     }
  343 |     
  344 |     // Navigate to a protected page
  345 |     await page.goto('/ar/folio');
  346 |     
  347 |     // Should be redirected to login
  348 |     await expect(page).toHaveURL(/\/login/);
  349 |   });
  350 | 
  351 |   test('should clear token on logout', async ({ page }) => {
  352 |     // Verify token exists
  353 |     let token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  354 |     expect(token).toBeTruthy();
  355 |     
  356 |     // Clear token (simulate logout)
  357 |     await page.evaluate(() => {
  358 |       localStorage.removeItem('AccessToken');
  359 |     });
  360 |     
```
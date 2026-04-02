# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/login.spec.ts >> Login Flow - Authentication >> should login successfully with valid credentials
- Location: tests/e2e/auth/login.spec.ts:143:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
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
  49  |     await expect(page.getByText('Enter your username to continue')).toBeVisible();
  50  |     
  51  |     const usernameField = page.getByPlaceholder('Enter your username');
  52  |     const nextButton = page.getByRole('button', { name: 'Next' });
  53  |     
  54  |     await expect(usernameField).toBeVisible();
  55  |     await expect(nextButton).toBeVisible();
  56  |     await expect(nextButton).toBeEnabled();
  57  |     
  58  |     // Check for developer mode hint with credentials
  59  |     await expect(page.getByText('Developer Mode')).toBeVisible();
  60  |     await expect(page.getByText(/admin/)).toBeVisible();
  61  |     await expect(page.getByText(/alpha/)).toBeVisible();
  62  |   });
  63  | 
  64  |   test('should have working username input', async ({ page }) => {
  65  |     const usernameField = page.getByPlaceholder('Enter your username');
  66  |     
  67  |     // Type in username field
  68  |     await usernameField.fill('testuser');
  69  |     await expect(usernameField).toHaveValue('testuser');
  70  |     
  71  |     // Clear the field
  72  |     await usernameField.clear();
  73  |     await expect(usernameField).toHaveValue('');
  74  |   });
  75  | 
  76  |   test('should show form validation for empty username', async ({ page }) => {
  77  |     // Click Next without entering username
  78  |     await page.getByRole('button', { name: 'Next' }).click();
  79  |     
  80  |     // Should remain on login page
  81  |     await expect(page).toHaveURL(/\/login/);
  82  |     
  83  |     // Should show validation error
  84  |     await expect(page.getByText('Username is required')).toBeVisible({ timeout: 5000 });
  85  |   });
  86  | });
  87  | 
  88  | test.describe('Login Flow - Step 1 to Step 2 Transition', () => {
  89  |   test.beforeEach(async ({ page }) => {
  90  |     await page.goto('/login');
  91  |     await page.evaluate(() => {
  92  |       localStorage.clear();
  93  |       sessionStorage.clear();
  94  |     });
  95  |   });
  96  | 
  97  |   test('should advance to password step after entering valid username', async ({ page }) => {
  98  |     // Enter valid username
  99  |     await page.getByPlaceholder('Enter your username').fill('admin');
  100 |     await page.getByRole('button', { name: 'Next' }).click();
  101 |     
  102 |     // Wait for password field with extended timeout (may need API call)
  103 |     const passwordField = page.locator('input[type="password"]').first();
  104 |     try {
  105 |       await expect(passwordField).toBeVisible({ timeout: 10000 });
  106 |       
  107 |       // Verify we're on password step
  108 |       await expect(page.getByText(/password/i).first()).toBeVisible();
  109 |       await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
  110 |     } catch (e) {
  111 |       // If password field doesn't appear, take screenshot for debugging
  112 |       await page.screenshot({ path: 'test-results/login-step2-failed.png' });
  113 |       throw e;
  114 |     }
  115 |   });
  116 | 
  117 |   test('should show form validation for empty password', async ({ page }) => {
  118 |     // Step 1: Enter username
  119 |     await page.getByPlaceholder('Enter your username').fill('admin');
  120 |     await page.getByRole('button', { name: 'Next' }).click();
  121 |     
  122 |     // Wait for password field
  123 |     const passwordField = page.locator('input[type="password"]').first();
  124 |     await expect(passwordField).toBeVisible({ timeout: 10000 });
  125 |     
  126 |     // Click Sign In without entering password
  127 |     await page.getByRole('button', { name: /sign in|login/i }).click();
  128 |     
  129 |     // Should show validation error
  130 |     await expect(page.getByText('Password is required')).toBeVisible({ timeout: 5000 });
  131 |   });
  132 | });
  133 | 
  134 | test.describe('Login Flow - Authentication', () => {
  135 |   test.beforeEach(async ({ page }) => {
  136 |     await page.goto('/login');
  137 |     await page.evaluate(() => {
  138 |       localStorage.clear();
  139 |       sessionStorage.clear();
  140 |     });
  141 |   });
  142 | 
  143 |   test('should login successfully with valid credentials', async ({ page }) => {
  144 |     // Perform two-step login
  145 |     await page.getByPlaceholder('Enter your username').fill('admin');
  146 |     await page.getByRole('button', { name: 'Next' }).click();
  147 |     
  148 |     // Wait for password field
> 149 |     await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  150 |     
  151 |     await page.getByPlaceholder('Enter your password').fill('alpha');
  152 |     await page.getByRole('button', { name: 'Sign In' }).click();
  153 |     
  154 |     // Wait for navigation to dashboard
  155 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  156 |     
  157 |     // Verify we're logged in (dashboard visible)
  158 |     await expect(page.locator('body')).toBeVisible();
  159 |     await expect(page).not.toHaveURL(/\/login/);
  160 |     
  161 |     // Verify token is stored
  162 |     const token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  163 |     expect(token).toBeTruthy();
  164 |   });
  165 | 
  166 |   test('should show error for invalid password', async ({ page }) => {
  167 |     // Step 1: Enter username
  168 |     await page.getByPlaceholder('Enter your username').fill('admin');
  169 |     await page.getByRole('button', { name: 'Next' }).click();
  170 |     
  171 |     // Wait for password field
  172 |     await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  173 |     
  174 |     // Step 2: Enter wrong password
  175 |     await page.getByPlaceholder('Enter your password').fill('wrongpassword');
  176 |     await page.getByRole('button', { name: 'Sign In' }).click();
  177 |     
  178 |     // Wait for error
  179 |     await page.waitForTimeout(1000);
  180 |     
  181 |     // Should show error notification or message
  182 |     const errorVisible = await page.locator('.mantine-Notification-root, [role="alert"], .error').first().isVisible().catch(() => false);
  183 |     
  184 |     // Or should show inline error
  185 |     const hasErrorText = await page.getByText(/invalid|incorrect|failed|error/i).first().isVisible().catch(() => false);
  186 |     
  187 |     expect(errorVisible || hasErrorText).toBe(true);
  188 |   });
  189 | 
  190 |   test('should show error for non-existent username', async ({ page }) => {
  191 |     // Enter non-existent username
  192 |     await page.getByPlaceholder('Enter your username').fill('nonexistentuser12345');
  193 |     await page.getByRole('button', { name: 'Next' }).click();
  194 |     
  195 |     // Wait for response
  196 |     await page.waitForTimeout(2000);
  197 |     
  198 |     // Should show error notification or stay on login page
  199 |     const hasError = await page.locator('.mantine-Notification-root, [role="alert"]').first().isVisible().catch(() => false);
  200 |     const stillOnLogin = page.url().includes('/login');
  201 |     
  202 |     expect(hasError || stillOnLogin).toBe(true);
  203 |   });
  204 | });
  205 | 
  206 | test.describe('Login Flow - Redirect After Login', () => {
  207 |   test.beforeEach(async ({ page }) => {
  208 |     await page.goto('/login');
  209 |     await page.evaluate(() => {
  210 |       localStorage.clear();
  211 |       sessionStorage.clear();
  212 |     });
  213 |   });
  214 | 
  215 |   test('should redirect to originally requested page after login', async ({ page }) => {
  216 |     // Try to access a protected page directly
  217 |     const targetUrl = '/ar/folio';
  218 |     await page.goto(targetUrl);
  219 |     
  220 |     // Check if redirected to login or shows auth error
  221 |     const currentUrl = page.url();
  222 |     
  223 |     if (currentUrl.includes('/login')) {
  224 |       // Login flow with redirect
  225 |       await page.getByPlaceholder('Enter your username').fill('admin');
  226 |       await page.getByRole('button', { name: 'Next' }).click();
  227 |       
  228 |       await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  229 |       await page.getByPlaceholder('Enter your password').fill('alpha');
  230 |       await page.getByRole('button', { name: 'Sign In' }).click();
  231 |       
  232 |       // Should redirect to originally requested page
  233 |       await page.waitForURL(/\/ar\/folio/, { timeout: 15000 });
  234 |       await expect(page).toHaveURL(/\/ar\/folio/);
  235 |     } else {
  236 |       // If not redirected, page should require auth (might show blank or error)
  237 |       // This indicates the protected route guard is not implemented yet
  238 |       test.skip();
  239 |     }
  240 |   });
  241 | });
  242 | 
  243 | test.describe('Login UI - Accessibility', () => {
  244 |   test.beforeEach(async ({ page }) => {
  245 |     await page.goto('/login');
  246 |   });
  247 | 
  248 |   test('should have accessible form elements', async ({ page }) => {
  249 |     // Check for label
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/login.spec.ts >> Login Flow - Authentication >> should show error for invalid password
- Location: tests/e2e/auth/login.spec.ts:164:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.mantine-Notification-root')
Expected: visible
Error: strict mode violation: locator('.mantine-Notification-root') resolved to 2 elements:
    1) <div role="alert" data-with-icon="true" id="mantine-66mlq9g57" class="m_5ed0edd0 mantine-Notifications-notification m_a513464 mantine-Notification-root">…</div> aka getByRole('alert').filter({ hasText: 'SuccessUser validated. Please' })
    2) <div role="alert" data-with-icon="true" id="mantine-z4vqetw7b" class="m_5ed0edd0 mantine-Notifications-notification m_a513464 mantine-Notification-root">…</div> aka locator('#mantine-z4vqetw7b')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.mantine-Notification-root')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img [ref=e8]
          - heading "Enter Password" [level=2] [ref=e12]
          - paragraph [ref=e13]: Welcome back, admin
        - separator [ref=e14]
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: Username
            - generic [ref=e19]:
              - img [ref=e21]
              - textbox "Username" [disabled] [ref=e24]:
                - /placeholder: Enter your username
                - text: admin
          - generic [ref=e25]:
            - generic [ref=e26]: Password
            - generic [ref=e27]:
              - img [ref=e29]
              - textbox "Password" [ref=e34]:
                - /placeholder: Enter your password
                - text: wrongpassword
              - button [ref=e36] [cursor=pointer]:
                - img [ref=e38]
          - generic [ref=e40]:
            - generic [ref=e41]: Business Unit (Tenant)
            - generic [ref=e42]:
              - img [ref=e44]
              - textbox "Business Unit (Tenant)" [ref=e46] [cursor=pointer]:
                - /placeholder: Select tenant
                - text: Development (dev)
              - generic:
                - img
          - generic [ref=e47]:
            - generic [ref=e48]: Language
            - generic [ref=e49]:
              - img [ref=e51]
              - textbox "Language" [ref=e56] [cursor=pointer]:
                - /placeholder: Select language
                - text: English (United States)
              - generic:
                - img
          - generic [ref=e58]:
            - generic [ref=e59]:
              - checkbox "Remember me" [ref=e60]
              - img
            - generic [ref=e62]: Remember me
          - generic [ref=e63]:
            - button "Back" [ref=e64] [cursor=pointer]:
              - generic [ref=e66]: Back
            - button "Sign In" [ref=e67] [cursor=pointer]:
              - generic [ref=e68]:
                - img [ref=e70]
                - generic [ref=e74]: Sign In
        - button "Forgot password?" [ref=e76] [cursor=pointer]:
          - generic [ref=e78]: Forgot password?
        - paragraph [ref=e79]:
          - text: Copyright ©
          - link "Carmen Software Co.,Ltd." [ref=e80] [cursor=pointer]:
            - /url: https://carmensoftware.com/
          - text: "2026."
      - paragraph [ref=e82]:
        - text: 🔧 Developer Mode
        - text: "Default: Tenant=dev, UserName=admin, Password=alpha"
    - generic [ref=e83]:
      - img [ref=e85]
      - button "Open Tanstack query devtools" [ref=e133] [cursor=pointer]:
        - img [ref=e134]
  - generic [ref=e183]:
    - alert [ref=e184]:
      - img [ref=e186]
      - generic [ref=e188]:
        - generic [ref=e189]: Success
        - generic [ref=e190]: User validated. Please enter your password.
      - button [ref=e191] [cursor=pointer]:
        - img [ref=e192]
    - alert [ref=e194]:
      - img [ref=e196]
      - generic [ref=e199]:
        - generic [ref=e200]: Login Failed
        - generic [ref=e201]: Invalid credentials. Use admin/alpha for development.
      - button [ref=e202] [cursor=pointer]:
        - img [ref=e203]
```

# Test source

```ts
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
  102 |     // Wait for step 2 UI to appear with extended timeout (may need API call)
  103 |     await expect(page.getByRole('heading', { name: 'Enter Password' })).toBeVisible({ timeout: 15000 });
  104 |     
  105 |     // Verify we're on password step - check for password field
  106 |     const passwordField = page.getByPlaceholder('Enter your password');
  107 |     await expect(passwordField).toBeVisible();
  108 |     await expect(passwordField).toBeEnabled();
  109 |     
  110 |     // Verify Sign In button is present
  111 |     await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  112 |     
  113 |     // Verify tenant select is present
  114 |     await expect(page.getByLabel('Business Unit (Tenant)')).toBeVisible();
  115 |     
  116 |     // Verify language select is present
  117 |     await expect(page.getByLabel('Language')).toBeVisible();
  118 |     
  119 |     // Verify Back button is present
  120 |     await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  121 |   });
  122 | 
  123 |   test('should show form validation for empty password', async ({ page }) => {
  124 |     // Step 1: Enter username
  125 |     await page.getByPlaceholder('Enter your username').fill('admin');
  126 |     await page.getByRole('button', { name: 'Next' }).click();
  127 |     
  128 |     // Wait for step 2 UI
  129 |     await expect(page.getByRole('heading', { name: 'Enter Password' })).toBeVisible({ timeout: 15000 });
  130 |     await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  131 |     
  132 |     // Click Sign In without entering password
  133 |     await page.getByRole('button', { name: 'Sign In' }).click();
  134 |     
  135 |     // Should show validation error
  136 |     await expect(page.getByText('Password is required')).toBeVisible({ timeout: 5000 });
  137 |   });
  138 | });
  139 | 
  140 | test.describe('Login Flow - Authentication', () => {
  141 |   test.beforeEach(async ({ page }) => {
  142 |     await page.goto('/login');
  143 |     await page.evaluate(() => {
  144 |       localStorage.clear();
  145 |       sessionStorage.clear();
  146 |     });
  147 |   });
  148 | 
  149 |   test('should login successfully with valid credentials', async ({ page }) => {
  150 |     // Perform two-step login
  151 |     await performLogin(page);
  152 |     
  153 |     // Wait for navigation to dashboard
  154 |     await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  155 |     
  156 |     // Verify we're logged in (not on login page)
  157 |     await expect(page).not.toHaveURL(/\/login/);
  158 |     
  159 |     // Verify token is stored
  160 |     const token = await page.evaluate(() => localStorage.getItem('AccessToken'));
  161 |     expect(token).toBeTruthy();
  162 |   });
  163 | 
  164 |   test('should show error for invalid password', async ({ page }) => {
  165 |     // Step 1: Enter username
  166 |     await page.getByPlaceholder('Enter your username').fill('admin');
  167 |     await page.getByRole('button', { name: 'Next' }).click();
  168 |     
  169 |     // Wait for step 2 UI
  170 |     await expect(page.getByPlaceholder('Enter your password')).toBeVisible({ timeout: 15000 });
  171 |     
  172 |     // Step 2: Enter wrong password
  173 |     await page.getByPlaceholder('Enter your password').fill('wrongpassword');
  174 |     await page.getByRole('button', { name: 'Sign In' }).click();
  175 |     
  176 |     // Wait for error notification (Mantine notification)
> 177 |     await expect(page.locator('.mantine-Notification-root')).toBeVisible({ timeout: 5000 });
      |                                                              ^ Error: expect(locator).toBeVisible() failed
  178 |     
  179 |     // Should show error message
  180 |     const errorText = await page.locator('.mantine-Notification-root').textContent();
  181 |     expect(errorText?.toLowerCase()).toMatch(/invalid|failed|error/);
  182 |     
  183 |     // Should still be on login page
  184 |     await expect(page).toHaveURL(/\/login/);
  185 |   });
  186 | 
  187 |   test('should show error for non-existent username', async ({ page }) => {
  188 |     // Enter non-existent username
  189 |     await page.getByPlaceholder('Enter your username').fill('nonexistentuser12345');
  190 |     await page.getByRole('button', { name: 'Next' }).click();
  191 |     
  192 |     // Wait for error notification
  193 |     await expect(page.locator('.mantine-Notification-root')).toBeVisible({ timeout: 5000 });
  194 |     
  195 |     // Should show error or stay on login page
  196 |     await expect(page).toHaveURL(/\/login/);
  197 |   });
  198 | });
  199 | 
  200 | test.describe('Login Flow - Redirect After Login', () => {
  201 |   test.beforeEach(async ({ page }) => {
  202 |     await page.goto('/login');
  203 |     await page.evaluate(() => {
  204 |       localStorage.clear();
  205 |       sessionStorage.clear();
  206 |     });
  207 |   });
  208 | 
  209 |   test('should redirect to originally requested page after login', async ({ page }) => {
  210 |     // Try to access a protected page directly
  211 |     const targetUrl = '/gl/journal-voucher';  // Use a route that actually exists
  212 |     await page.goto(targetUrl);
  213 |     
  214 |     // Check if redirected to login
  215 |     await expect(page).toHaveURL(/\/login/);
  216 |     
  217 |     // Verify redirect info is stored
  218 |     const fromState = await page.evaluate(() => {
  219 |       // The router stores the 'from' location in history state
  220 |       return window.history.state?.usr?.from?.pathname;
  221 |     });
  222 |     
  223 |     // Login with two-step flow
  224 |     await performLogin(page);
  225 |     
  226 |     // Should redirect to originally requested page or dashboard
  227 |     await page.waitForURL(/\/(gl\/journal-voucher|dashboard|home|$)/, { timeout: 15000 });
  228 |   });
  229 | });
  230 | 
  231 | test.describe('Login UI - Accessibility', () => {
  232 |   test.beforeEach(async ({ page }) => {
  233 |     await page.goto('/login');
  234 |   });
  235 | 
  236 |   test('should have accessible form elements', async ({ page }) => {
  237 |     // Check for label
  238 |     await expect(page.getByLabel('Username')).toBeVisible();
  239 |     
  240 |     // Check button is properly labeled
  241 |     const nextButton = page.getByRole('button', { name: 'Next' });
  242 |     await expect(nextButton).toHaveAttribute('type', 'submit');
  243 |   });
  244 | 
  245 |   test('should have proper page structure', async ({ page }) => {
  246 |     // Check main elements
  247 |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  248 |     await expect(page.getByText('Copyright')).toBeVisible();
  249 |     await expect(page.getByText('Carmen Software Co.,Ltd.')).toBeVisible();
  250 |   });
  251 | });
  252 | 
```
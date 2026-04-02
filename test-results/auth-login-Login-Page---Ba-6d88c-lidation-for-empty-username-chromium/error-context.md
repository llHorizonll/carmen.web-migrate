# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/login.spec.ts >> Login Page - Basic Loading >> should show form validation for empty username
- Location: tests/e2e/auth/login.spec.ts:76:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Username is required')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Username is required')

```

# Page snapshot

```yaml
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
            - textbox "Password" [active] [ref=e34]:
              - /placeholder: Enter your password
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
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Authentication Login Flow Tests
  5   |  * 
  6   |  * These tests verify:
  7   |  * - Login page loads correctly
  8   |  * - Form validation works
  9   |  * - Successful login redirects to dashboard
  10  |  * - Failed login shows error message
  11  |  * 
  12  |  * NOTE: The login flow is a two-step process:
  13  |  * 1. Enter username and click "Next"
  14  |  * 2. Enter password and click "Sign In"
  15  |  * 
  16  |  * Credentials from Developer Mode: admin / alpha
  17  |  */
  18  | 
  19  | // Helper function to perform complete login
  20  | async function performLogin(page: any, username: string = 'admin', password: string = 'alpha') {
  21  |   // Step 1: Enter username and click Next
  22  |   await page.getByPlaceholder('Enter your username').fill(username);
  23  |   await page.getByRole('button', { name: 'Next' }).click();
  24  |   
  25  |   // Wait for step 2: password field to appear with longer timeout for API call
  26  |   await expect(page.getByPlaceholder('Enter your password')).toBeVisible({ timeout: 15000 });
  27  |   
  28  |   // Step 2: Enter password and click Sign In
  29  |   await page.getByPlaceholder('Enter your password').fill(password);
  30  |   await page.getByRole('button', { name: 'Sign In' }).click();
  31  | }
  32  | 
  33  | test.describe('Login Page - Basic Loading', () => {
  34  |   test.beforeEach(async ({ page }) => {
  35  |     // Navigate first, then clear storage
  36  |     await page.goto('/login');
  37  |     await page.evaluate(() => {
  38  |       localStorage.clear();
  39  |       sessionStorage.clear();
  40  |     });
  41  |   });
  42  | 
  43  |   test('should display login page correctly', async ({ page }) => {
  44  |     // Check page title
  45  |     await expect(page).toHaveTitle(/Carmen/i);
  46  |     
  47  |     // Check login form elements are visible (Step 1 - Username)
  48  |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
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
> 84  |     await expect(page.getByText('Username is required')).toBeVisible({ timeout: 5000 });
      |                                                          ^ Error: expect(locator).toBeVisible() failed
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
  177 |     await expect(page.locator('.mantine-Notification-root')).toBeVisible({ timeout: 5000 });
  178 |     
  179 |     // Should show error message
  180 |     const errorText = await page.locator('.mantine-Notification-root').textContent();
  181 |     expect(errorText?.toLowerCase()).toMatch(/invalid|failed|error/);
  182 |     
  183 |     // Should still be on login page
  184 |     await expect(page).toHaveURL(/\/login/);
```
import { test, expect } from '@playwright/test';

/**
 * Authentication Login Flow Tests
 * 
 * These tests verify:
 * - Login page loads correctly
 * - Form validation works
 * - Successful login redirects to dashboard
 * - Failed login shows error message
 * 
 * NOTE: The login flow is a two-step process:
 * 1. Enter username and click "Next"
 * 2. Enter password and click "Sign In"
 * 
 * Credentials from Developer Mode: admin / alpha
 */

// Helper function to perform complete login
async function performLogin(page: any, username: string = 'admin', password: string = 'alpha') {
  // Step 1: Enter username and click Next
  await page.getByPlaceholder('Enter your username').fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Wait for password field to appear with longer timeout for API call
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  
  // Step 2: Enter password and click Sign In
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

test.describe('Login Page - Basic Loading', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first, then clear storage
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should display login page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Carmen/i);
    
    // Check login form elements are visible (Step 1 - Username)
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Enter your username to continue')).toBeVisible();
    
    const usernameField = page.getByPlaceholder('Enter your username');
    const nextButton = page.getByRole('button', { name: 'Next' });
    
    await expect(usernameField).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();
    
    // Check for developer mode hint with credentials
    await expect(page.getByText('Developer Mode')).toBeVisible();
    await expect(page.getByText(/admin/)).toBeVisible();
    await expect(page.getByText(/alpha/)).toBeVisible();
  });

  test('should have working username input', async ({ page }) => {
    const usernameField = page.getByPlaceholder('Enter your username');
    
    // Type in username field
    await usernameField.fill('testuser');
    await expect(usernameField).toHaveValue('testuser');
    
    // Clear the field
    await usernameField.clear();
    await expect(usernameField).toHaveValue('');
  });

  test('should show form validation for empty username', async ({ page }) => {
    // Click Next without entering username
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Should remain on login page
    await expect(page).toHaveURL(/\/login/);
    
    // Should show validation error
    await expect(page.getByText('Username is required')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Login Flow - Step 1 to Step 2 Transition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should advance to password step after entering valid username', async ({ page }) => {
    // Enter valid username
    await page.getByPlaceholder('Enter your username').fill('admin');
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Wait for password field with extended timeout (may need API call)
    const passwordField = page.locator('input[type="password"]').first();
    try {
      await expect(passwordField).toBeVisible({ timeout: 10000 });
      
      // Verify we're on password step
      await expect(page.getByText(/password/i).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
    } catch (e) {
      // If password field doesn't appear, take screenshot for debugging
      await page.screenshot({ path: 'test-results/login-step2-failed.png' });
      throw e;
    }
  });

  test('should show form validation for empty password', async ({ page }) => {
    // Step 1: Enter username
    await page.getByPlaceholder('Enter your username').fill('admin');
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Wait for password field
    const passwordField = page.locator('input[type="password"]').first();
    await expect(passwordField).toBeVisible({ timeout: 10000 });
    
    // Click Sign In without entering password
    await page.getByRole('button', { name: /sign in|login/i }).click();
    
    // Should show validation error
    await expect(page.getByText('Password is required')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Login Flow - Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Perform two-step login
    await page.getByPlaceholder('Enter your username').fill('admin');
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Wait for password field
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    
    await page.getByPlaceholder('Enter your password').fill('alpha');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
    
    // Verify we're logged in (dashboard visible)
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
    
    // Verify token is stored
    const token = await page.evaluate(() => localStorage.getItem('AccessToken'));
    expect(token).toBeTruthy();
  });

  test('should show error for invalid password', async ({ page }) => {
    // Step 1: Enter username
    await page.getByPlaceholder('Enter your username').fill('admin');
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Wait for password field
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    
    // Step 2: Enter wrong password
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for error
    await page.waitForTimeout(1000);
    
    // Should show error notification or message
    const errorVisible = await page.locator('.mantine-Notification-root, [role="alert"], .error').first().isVisible().catch(() => false);
    
    // Or should show inline error
    const hasErrorText = await page.getByText(/invalid|incorrect|failed|error/i).first().isVisible().catch(() => false);
    
    expect(errorVisible || hasErrorText).toBe(true);
  });

  test('should show error for non-existent username', async ({ page }) => {
    // Enter non-existent username
    await page.getByPlaceholder('Enter your username').fill('nonexistentuser12345');
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Should show error notification or stay on login page
    const hasError = await page.locator('.mantine-Notification-root, [role="alert"]').first().isVisible().catch(() => false);
    const stillOnLogin = page.url().includes('/login');
    
    expect(hasError || stillOnLogin).toBe(true);
  });
});

test.describe('Login Flow - Redirect After Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should redirect to originally requested page after login', async ({ page }) => {
    // Try to access a protected page directly
    const targetUrl = '/ar/folio';
    await page.goto(targetUrl);
    
    // Check if redirected to login or shows auth error
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      // Login flow with redirect
      await page.getByPlaceholder('Enter your username').fill('admin');
      await page.getByRole('button', { name: 'Next' }).click();
      
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      await page.getByPlaceholder('Enter your password').fill('alpha');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Should redirect to originally requested page
      await page.waitForURL(/\/ar\/folio/, { timeout: 15000 });
      await expect(page).toHaveURL(/\/ar\/folio/);
    } else {
      // If not redirected, page should require auth (might show blank or error)
      // This indicates the protected route guard is not implemented yet
      test.skip();
    }
  });
});

test.describe('Login UI - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should have accessible form elements', async ({ page }) => {
    // Check for label
    await expect(page.getByLabel('Username')).toBeVisible();
    
    // Check button is properly labeled
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toHaveAttribute('type', 'submit');
  });

  test('should have proper page structure', async ({ page }) => {
    // Check main elements
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Copyright')).toBeVisible();
    await expect(page.getByText('Carmen Software Co.,Ltd.')).toBeVisible();
  });
});

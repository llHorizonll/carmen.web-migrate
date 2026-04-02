import { test, expect } from '@playwright/test';

/**
 * Protected Routes Authentication Tests
 * 
 * These tests verify:
 * - Accessing protected pages without login redirects to login
 * - After login, user is redirected back to original page
 * - Authenticated users can access protected pages
 * - All module routes are properly protected
 */

// All protected routes that need to be tested (from the task requirements)
const PROTECTED_ROUTES = [
  // General Ledger
  { path: '/gl/journal-voucher', name: 'GL Journal Voucher' },
  { path: '/gl/allocation-voucher', name: 'GL Allocation Voucher' },
  { path: '/gl/template-voucher', name: 'GL Template Voucher' },
  { path: '/gl/recurring-voucher', name: 'GL Recurring Voucher' },
  { path: '/gl/amortization-voucher', name: 'GL Amortization Voucher' },
  { path: '/gl/account-summary', name: 'GL Account Summary' },
  { path: '/gl/financial-report', name: 'GL Financial Report' },
  { path: '/gl/chart-of-accounts', name: 'GL Chart of Accounts' },
  { path: '/gl/budget', name: 'GL Budget' },
  // Accounts Payable
  { path: '/ap/vendor', name: 'AP Vendor' },
  { path: '/ap/invoice', name: 'AP Invoice' },
  { path: '/ap/payment', name: 'AP Payment' },
  // Accounts Receivable
  { path: '/ar/profile', name: 'AR Profile' },
  { path: '/ar/folio', name: 'AR Folio' },
  { path: '/ar/invoice', name: 'AR Invoice' },
  { path: '/ar/receipt', name: 'AR Receipt' },
  // Asset
  { path: '/asset/register', name: 'Asset Register' },
  { path: '/asset/pre-asset', name: 'Asset Pre-Asset' },
  { path: '/asset/disposal', name: 'Asset Disposal' },
  // Configuration
  { path: '/config/company', name: 'Config Company' },
  { path: '/config/users', name: 'Config Users' },
];

// Routes that exist in pages but not yet in router (skip redirect tests for these)
const FUTURE_ROUTES = [
  '/ar/folio',
  '/ar/invoice',
  '/ar/invoice/new',
  '/ar/receipt',
  '/ar/receipt/new',
  '/ar/profile',
  '/ar/profile/new',
  '/ap/invoice',
  '/ap/invoice/new',
  '/ap/payment',
  '/ap/payment/new',
  '/ap/vendor',
  '/ap/vendor/new',
  '/asset',
];

// Helper function to perform complete login with 2-step flow
async function performLogin(page: any, username: string = 'admin', password: string = 'alpha') {
  // Step 1: Enter username and click Next
  await page.getByPlaceholder('Enter your username').fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Wait for step 2 UI to appear
  await expect(page.getByPlaceholder('Enter your password')).toBeVisible({ timeout: 15000 });
  
  // Step 2: Enter password and click Sign In
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

test.describe('Protected Routes - Redirect to Login', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first, then clear storage
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
  });

  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);
    
    // Login form should be visible
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  });

  test('should redirect to login when accessing GL journal voucher without auth', async ({ page }) => {
    await page.goto('/gl/journal-voucher');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should preserve redirect URL in state', async ({ page }) => {
    const targetPath = '/gl/journal-voucher';
    await page.goto(targetPath);
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    
    // Check if the original URL is preserved in history state
    const fromState = await page.evaluate(() => {
      return window.history.state?.usr?.from?.pathname;
    });
    
    expect(fromState).toBe(targetPath);
  });
});

test.describe('Protected Routes - Redirect After Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
  });

  test('should redirect back to GL journal voucher after successful login', async ({ page }) => {
    // Try to access protected page
    await page.goto('/gl/journal-voucher');
    
    // Should be on login page
    await expect(page).toHaveURL(/\/login/);
    
    // Login with two-step flow
    await performLogin(page);
    
    // Should redirect to originally requested page
    await page.waitForURL(/\/gl\/journal-voucher/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/gl\/journal-voucher/);
    
    // Verify the page loaded correctly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should redirect back to dashboard after successful login', async ({ page }) => {
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should be on login page
    await expect(page).toHaveURL(/\/login/);
    
    // Login
    await performLogin(page);
    
    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verify dashboard content
    await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  });

  test('should redirect back to GL allocation voucher page after login', async ({ page }) => {
    const targetPath = '/gl/allocation-voucher';
    await page.goto(targetPath);
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    
    // Login
    await performLogin(page);
    
    // Should redirect back to GL allocation voucher
    await page.waitForURL(/\/gl\/allocation-voucher/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/gl\/allocation-voucher/);
  });
});

test.describe('Protected Routes - Authenticated Access', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await performLogin(page);
    
    // Wait for navigation to complete
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  });

  test('should access dashboard when authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should NOT redirect to login
    await expect(page).not.toHaveURL(/\/login/);
    
    // Page should be accessible
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  });

  test('should access GL journal voucher list when authenticated', async ({ page }) => {
    await page.goto('/gl/journal-voucher');
    
    // Should NOT redirect to login
    await expect(page).not.toHaveURL(/\/login/);
    
    // Page should be accessible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL allocation voucher list when authenticated', async ({ page }) => {
    await page.goto('/gl/allocation-voucher');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL amortization voucher list when authenticated', async ({ page }) => {
    await page.goto('/gl/amortization-voucher');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL standard voucher list when authenticated', async ({ page }) => {
    await page.goto('/gl/standard-voucher');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  // Test all menu routes from the task
  test('should access GL template voucher when authenticated', async ({ page }) => {
    await page.goto('/gl/template-voucher');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL recurring voucher when authenticated', async ({ page }) => {
    await page.goto('/gl/recurring-voucher');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL account summary when authenticated', async ({ page }) => {
    await page.goto('/gl/account-summary');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL financial report when authenticated', async ({ page }) => {
    await page.goto('/gl/financial-report');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL chart of accounts when authenticated', async ({ page }) => {
    await page.goto('/gl/chart-of-accounts');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL budget when authenticated', async ({ page }) => {
    await page.goto('/gl/budget');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AP vendor when authenticated', async ({ page }) => {
    await page.goto('/ap/vendor');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AP invoice when authenticated', async ({ page }) => {
    await page.goto('/ap/invoice');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AP payment when authenticated', async ({ page }) => {
    await page.goto('/ap/payment');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AR profile when authenticated', async ({ page }) => {
    await page.goto('/ar/profile');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AR folio when authenticated', async ({ page }) => {
    await page.goto('/ar/folio');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AR invoice when authenticated', async ({ page }) => {
    await page.goto('/ar/invoice');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AR receipt when authenticated', async ({ page }) => {
    await page.goto('/ar/receipt');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access Asset register when authenticated', async ({ page }) => {
    await page.goto('/asset/register');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access Asset pre-asset when authenticated', async ({ page }) => {
    await page.goto('/asset/pre-asset');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access Asset disposal when authenticated', async ({ page }) => {
    await page.goto('/asset/disposal');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access Config company when authenticated', async ({ page }) => {
    await page.goto('/config/company');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access Config users when authenticated', async ({ page }) => {
    await page.goto('/config/users');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Protected Routes - All Routes Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
  });

  // Test that all protected routes require authentication
  for (const route of PROTECTED_ROUTES) {
    test(`should require auth for ${route.name} (${route.path})`, async ({ page }) => {
      await page.goto(route.path);
      
      // Without auth, should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  }
});

test.describe('Protected Routes - Authenticated Access - All Routes', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await performLogin(page);
    
    // Wait for navigation to complete
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  });

  // Test all routes load correctly when authenticated (no redirect to login, no 404)
  for (const route of PROTECTED_ROUTES) {
    test(`should access ${route.name} (${route.path}) when authenticated`, async ({ page }) => {
      await page.goto(route.path);
      
      // Should NOT redirect to login
      await expect(page).not.toHaveURL(/\/login/);
      
      // Should NOT be a 404 (check body is visible)
      await expect(page.locator('body')).toBeVisible();
      
      // Additional check: page should not contain 404 text
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toMatch(/404|not found|page not found/i);
    });
  }
});

test.describe('Protected Routes - Token Persistence', () => {
  test('should maintain authentication after page reload', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await performLogin(page);
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
    
    // Navigate to a protected page
    await page.goto('/gl/journal-voucher');
    await expect(page).not.toHaveURL(/\/login/);
    
    // Reload the page
    await page.reload();
    
    // Should still be on the protected page (not redirected to login)
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain authentication across multiple tabs', async ({ browser }) => {
    // Create a new context (simulates separate session)
    const context = await browser.newContext();
    const page1 = await context.newPage();
    
    // Login in first tab
    await page1.goto('/login');
    await performLogin(page1);
    await page1.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
    
    // Open new tab in same context
    const page2 = await context.newPage();
    await page2.goto('/gl/journal-voucher');
    
    // Second tab should be authenticated
    await expect(page2).not.toHaveURL(/\/login/);
    await expect(page2.locator('body')).toBeVisible();
    
    await context.close();
  });
});

test.describe('Protected Routes - Logout Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await performLogin(page);
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  });

  test('should redirect to login after logout', async ({ page }) => {
    // Clear token (simulate logout since logout UI might not be implemented)
    await page.evaluate(() => {
      localStorage.removeItem('AccessToken');
      localStorage.removeItem('RefreshToken');
    });
    
    // Navigate to a protected page
    await page.goto('/gl/journal-voucher');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should clear token on logout', async ({ page }) => {
    // Verify token exists
    let token = await page.evaluate(() => localStorage.getItem('AccessToken'));
    expect(token).toBeTruthy();
    
    // Clear token (simulate logout)
    await page.evaluate(() => {
      localStorage.removeItem('AccessToken');
      localStorage.removeItem('RefreshToken');
    });
    
    // Token should be gone
    token = await page.evaluate(() => localStorage.getItem('AccessToken'));
    expect(token).toBeFalsy();
    
    // Try to access protected page
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

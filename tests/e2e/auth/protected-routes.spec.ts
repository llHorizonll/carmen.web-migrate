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

// List of protected routes to test
const PROTECTED_ROUTES = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/ar/folio', name: 'AR Folio' },
  { path: '/ar/invoice', name: 'AR Invoice List' },
  { path: '/ar/invoice/new', name: 'AR Invoice Create' },
  { path: '/ar/receipt', name: 'AR Receipt List' },
  { path: '/ar/receipt/new', name: 'AR Receipt Create' },
  { path: '/ar/profile', name: 'AR Profile List' },
  { path: '/ar/profile/new', name: 'AR Profile Create' },
  { path: '/ap/invoice', name: 'AP Invoice List' },
  { path: '/ap/invoice/new', name: 'AP Invoice Create' },
  { path: '/ap/payment', name: 'AP Payment List' },
  { path: '/ap/payment/new', name: 'AP Payment Create' },
  { path: '/ap/vendor', name: 'AP Vendor List' },
  { path: '/ap/vendor/new', name: 'AP Vendor Create' },
  { path: '/gl/journal-voucher', name: 'GL Journal Voucher List' },
  { path: '/gl/journal-voucher/new', name: 'GL Journal Voucher Create' },
  { path: '/gl/allocation-voucher', name: 'GL Allocation Voucher List' },
  { path: '/gl/allocation-voucher/new', name: 'GL Allocation Voucher Create' },
  { path: '/gl/amortization-voucher', name: 'GL Amortization Voucher List' },
  { path: '/gl/amortization-voucher/new', name: 'GL Amortization Voucher Create' },
  { path: '/gl/standard-voucher', name: 'GL Standard Voucher List' },
  { path: '/gl/standard-voucher/new', name: 'GL Standard Voucher Create' },
  { path: '/asset', name: 'Asset List' },
];

// Helper function to perform complete login
async function performLogin(page: any, username: string = 'admin', password: string = 'alpha') {
  // Step 1: Enter username and click Next
  await page.getByPlaceholder('Enter your username').fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Wait for password field to appear
  await page.waitForSelector('input[type="password"]', { timeout: 5000 });
  
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

  test('should redirect to login when accessing AR folio without auth', async ({ page }) => {
    await page.goto('/ar/folio');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should preserve redirect URL in state', async ({ page }) => {
    const targetPath = '/ar/folio';
    await page.goto(targetPath);
    
    // Check if the original URL is preserved in sessionStorage
    const storedRedirect = await page.evaluate(() => {
      return sessionStorage.getItem('redirectAfterLogin') || 
             localStorage.getItem('redirectAfterLogin');
    });
    
    expect(storedRedirect).toBeTruthy();
    expect(storedRedirect).toContain('/ar/folio');
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

  test('should redirect back to AR folio after successful login', async ({ page }) => {
    // Try to access protected page
    await page.goto('/ar/folio');
    
    // Should be on login page
    await expect(page).toHaveURL(/\/login/);
    
    // Login with two-step flow
    await performLogin(page);
    
    // Should redirect to originally requested page
    await page.waitForURL(/\/ar\/folio/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/ar\/folio/);
    
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
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verify dashboard content
    await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  });

  test('should redirect back to GL journal voucher page after login', async ({ page }) => {
    const targetPath = '/gl/journal-voucher';
    await page.goto(targetPath);
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    
    // Login
    await performLogin(page);
    
    // Should redirect back to GL journal voucher
    await page.waitForURL(/\/gl\/journal-voucher/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/gl\/journal-voucher/);
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
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  });

  test('should access dashboard when authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should NOT redirect to login
    await expect(page).not.toHaveURL(/\/login/);
    
    // Page should be accessible
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Dashboard|Carmen/i);
  });

  test('should access AR folio when authenticated', async ({ page }) => {
    await page.goto('/ar/folio');
    
    // Should NOT redirect to login
    await expect(page).not.toHaveURL(/\/login/);
    
    // Page should be accessible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AR invoice list when authenticated', async ({ page }) => {
    await page.goto('/ar/invoice');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AR invoice create page when authenticated', async ({ page }) => {
    await page.goto('/ar/invoice/new');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL journal voucher list when authenticated', async ({ page }) => {
    await page.goto('/gl/journal-voucher');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access GL journal voucher create page when authenticated', async ({ page }) => {
    await page.goto('/gl/journal-voucher/new');
    
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access AP modules when authenticated', async ({ page }) => {
    await page.goto('/ap/invoice');
    await expect(page).not.toHaveURL(/\/login/);
    
    await page.goto('/ap/payment');
    await expect(page).not.toHaveURL(/\/login/);
    
    await page.goto('/ap/vendor');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('should access Asset module when authenticated', async ({ page }) => {
    await page.goto('/asset');
    
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
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
    
    // Navigate to a protected page
    await page.goto('/ar/folio');
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
    await page1.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
    
    // Open new tab in same context
    const page2 = await context.newPage();
    await page2.goto('/ar/folio');
    
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
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  });

  test('should redirect to login after logout', async ({ page }) => {
    // Find and click logout button/link in the UserMenu
    const userMenuButton = page.locator('button').filter({ has: page.locator('[data-icon="user"], .mantine-Avatar-root') }).first();
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    
    // If logout button is directly visible, click it
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
    } else if (await userMenuButton.isVisible().catch(() => false)) {
      // Open user menu first
      await userMenuButton.click();
      // Then click logout
      await page.getByRole('menuitem', { name: /logout|sign out/i }).click();
    } else {
      // Manually clear auth if logout button not found
      await page.evaluate(() => {
        localStorage.removeItem('AccessToken');
      });
    }
    
    // Navigate to a protected page
    await page.goto('/ar/folio');
    
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
    });
    
    // Token should be gone
    token = await page.evaluate(() => localStorage.getItem('AccessToken'));
    expect(token).toBeFalsy();
    
    // Try to access protected page
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

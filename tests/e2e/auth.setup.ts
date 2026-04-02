import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth', 'user.json');

/**
 * Authentication setup - logs in and saves storage state
 * This runs once before all tests to establish authentication
 */
setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Wait for login form to be visible
  await expect(page.locator('body')).toBeVisible();
  
  // Note: The actual login form implementation may vary
  // This is a generic approach - adjust selectors based on actual UI
  
  // Check if we're already on a page with a login form
  const hasLoginForm = await page.locator('input[type="text"], input[name="username"], input[name="UserName"]').count() > 0;
  
  if (hasLoginForm) {
    // Fill in credentials (these should be set via environment variables in real usage)
    const username = process.env.TEST_USERNAME || 'admin';
    const password = process.env.TEST_PASSWORD || 'password';
    
    // Try to find and fill username field
    const usernameField = page.locator('input[type="text"], input[name="username"], input[name="UserName"]').first();
    if (await usernameField.isVisible().catch(() => false)) {
      await usernameField.fill(username);
    }
    
    // Try to find and fill password field
    const passwordField = page.locator('input[type="password"], input[name="password"], input[name="Password"]').first();
    if (await passwordField.isVisible().catch(() => false)) {
      await passwordField.fill(password);
    }
    
    // Try to click login button
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    if (await loginButton.isVisible().catch(() => false)) {
      await loginButton.click();
    }
    
    // Wait for navigation after login
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 }).catch(() => {
      // If navigation doesn't happen, we might already be on the page
      console.log('Navigation after login did not occur as expected');
    });
  }
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication state saved to:', authFile);
});

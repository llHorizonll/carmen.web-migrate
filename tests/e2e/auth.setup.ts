import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '.auth', 'user.json');

/**
 * Authentication setup - logs in and saves storage state
 * This runs once before all tests to establish authentication
 * 
 * Note: The login flow is a two-step process:
 * 1. Enter username and click "Next"
 * 2. Enter password + select tenant and click "Sign In"
 * 
 * Developer credentials: admin / alpha
 */
setup('authenticate', async ({ page }) => {
  const username = process.env.TEST_USERNAME || 'admin';
  const password = process.env.TEST_PASSWORD || 'alpha';

  // Navigate to login page
  await page.goto('/login');
  
  // Wait for login form to be visible
  await expect(page.locator('body')).toBeVisible();
  
  // Step 1: Fill username and click Next
  await page.getByPlaceholder('Enter your username').fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Wait for password field to appear (transition to step 2)
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  
  // Step 2: Fill password and click Sign In
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for navigation after login (to dashboard or home)
  await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 15000 });
  
  // Verify we're logged in by checking we're not on login page
  await expect(page).not.toHaveURL(/\/login/);
  
  console.log('Authentication successful, saving state to:', authFile);
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});

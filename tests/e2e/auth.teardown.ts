import { test as teardown } from '@playwright/test';

/**
 * Teardown - runs after all tests complete
 * Can be used to clean up test data or logout
 */
teardown('cleanup', async ({ page }) => {
  // Optional: Add cleanup logic here
  // For example, logout the user or clean up test data
  console.log('Test suite completed - cleanup if needed');
});

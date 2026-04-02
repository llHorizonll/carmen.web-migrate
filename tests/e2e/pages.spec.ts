import { test, expect } from '@playwright/test';

test.describe('Page Load Tests', () => {
  test.describe('Dashboard', () => {
    test('should load dashboard page', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveTitle(/Carmen/i);
    });
  });

  test.describe('GL Module - Journal Voucher', () => {
    test('should load journal voucher list page', async ({ page }) => {
      await page.goto('/gl/journal-voucher');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load journal voucher create page', async ({ page }) => {
      await page.goto('/gl/journal-voucher/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load journal voucher edit page', async ({ page }) => {
      await page.goto('/gl/journal-voucher/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('GL Module - Allocation Voucher', () => {
    test('should load allocation voucher list page', async ({ page }) => {
      await page.goto('/gl/allocation-voucher');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load allocation voucher create page', async ({ page }) => {
      await page.goto('/gl/allocation-voucher/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load allocation voucher edit page', async ({ page }) => {
      await page.goto('/gl/allocation-voucher/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('GL Module - Amortization Voucher', () => {
    test('should load amortization voucher list page', async ({ page }) => {
      await page.goto('/gl/amortization-voucher');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load amortization voucher create page', async ({ page }) => {
      await page.goto('/gl/amortization-voucher/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load amortization voucher edit page', async ({ page }) => {
      await page.goto('/gl/amortization-voucher/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('GL Module - Standard Voucher', () => {
    test('should load standard voucher list page', async ({ page }) => {
      await page.goto('/gl/standard-voucher');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load standard voucher create page', async ({ page }) => {
      await page.goto('/gl/standard-voucher/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load standard voucher edit page', async ({ page }) => {
      await page.goto('/gl/standard-voucher/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AP Module - Vendor', () => {
    test('should load vendor list page', async ({ page }) => {
      await page.goto('/ap/vendor');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load vendor create page', async ({ page }) => {
      await page.goto('/ap/vendor/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load vendor edit page', async ({ page }) => {
      await page.goto('/ap/vendor/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AP Module - Invoice', () => {
    test('should load AP invoice list page', async ({ page }) => {
      await page.goto('/ap/invoice');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load AP invoice create page', async ({ page }) => {
      await page.goto('/ap/invoice/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load AP invoice edit page', async ({ page }) => {
      await page.goto('/ap/invoice/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AP Module - Payment', () => {
    test('should load payment list page', async ({ page }) => {
      await page.goto('/ap/payment');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load payment create page', async ({ page }) => {
      await page.goto('/ap/payment/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load payment edit page', async ({ page }) => {
      await page.goto('/ap/payment/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AR Module - Invoice', () => {
    test('should load AR invoice list page', async ({ page }) => {
      await page.goto('/ar/invoice');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load AR invoice create page', async ({ page }) => {
      await page.goto('/ar/invoice/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load AR invoice edit page', async ({ page }) => {
      await page.goto('/ar/invoice/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AR Module - Receipt', () => {
    test('should load receipt list page', async ({ page }) => {
      await page.goto('/ar/receipt');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load receipt create page', async ({ page }) => {
      await page.goto('/ar/receipt/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load receipt edit page', async ({ page }) => {
      await page.goto('/ar/receipt/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AR Module - Profile', () => {
    test('should load AR profile list page', async ({ page }) => {
      await page.goto('/ar/profile');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load AR profile create page', async ({ page }) => {
      await page.goto('/ar/profile/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load AR profile edit page', async ({ page }) => {
      await page.goto('/ar/profile/123');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('AR Module - Folio', () => {
    test('should load folio list page', async ({ page }) => {
      await page.goto('/ar/folio');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Asset Module', () => {
    test('should load asset list page', async ({ page }) => {
      await page.goto('/asset');
      await expect(page.locator('body')).toBeVisible();
    });
  });
});

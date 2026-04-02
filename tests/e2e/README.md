# E2E Tests for Carmen Web

This directory contains Playwright E2E tests for the Carmen Web application.

## Directory Structure

```
tests/e2e/
├── auth.setup.ts           # Authentication setup (runs before all tests)
├── auth.teardown.ts        # Cleanup after tests
├── utils.ts                # Common test utilities and helpers
├── ar/                     # Accounts Receivable tests
│   ├── folio.spec.ts
│   ├── profile.spec.ts
│   ├── invoice.spec.ts
│   └── receipt.spec.ts
├── ap/                     # Accounts Payable tests
│   ├── invoice.spec.ts
│   └── payment.spec.ts
├── gl/                     # General Ledger tests
│   └── journal-voucher.spec.ts
└── asset/                  # Asset Management tests
    └── register.spec.ts
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/e2e/ar/invoice.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run specific browser
```bash
npx playwright test --project=chromium
```

## Test Coverage

### AR Module
- **Folio**: List view, date filters, profile info display, navigation
- **Profile**: CRUD operations, filtering, pagination, status badges
- **Invoice**: List view, create form, search/filter, status management
- **Receipt**: List view, create form, void status handling

### AP Module
- **Invoice**: List view, create form, vendor management, amount formatting
- **Payment**: List view, create form, bank/cheque info, payment processing

### GL Module
- **Journal Voucher**: List view, create form, prefix management, period filters

### Asset Module
- **Register**: List view, create form, depreciation fields, asset tracking

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:5173` (default)
- Browser: Chromium (can add Firefox/WebKit)
- Screenshots: Captured on failure
- Videos: Recorded on failure
- Traces: Captured on first retry

## Environment Variables

```bash
# Set base URL
BASE_URL=https://staging.example.com npx playwright test

# Set test credentials
TEST_USERNAME=admin TEST_PASSWORD=secret npx playwright test
```

## Authentication

Tests use saved authentication state:
1. `auth.setup.ts` logs in and saves state to `.auth/user.json`
2. All other tests use this saved state
3. This avoids logging in for every test

## Writing New Tests

See `utils.ts` for common helpers and test data.

Example test structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path/to/page');
  });

  test('test description', async ({ page }) => {
    // Your test code here
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

## Troubleshooting

### Tests failing due to timeouts
Increase timeout in `playwright.config.ts` or use:
```bash
npx playwright test --timeout=60000
```

### Browser not found
```bash
npx playwright install
```

### Clear auth state
Delete `.auth/user.json` and re-run tests to re-authenticate.

# Playwright E2E Test Suite - Carmen Web

## Summary

Comprehensive E2E tests have been created for the carmen.web-migrate project covering all major modules and pages.

## Test Coverage

### AR (Accounts Receivable) Module
| Page | Test File | Coverage |
|------|-----------|----------|
| Folio | `tests/e2e/ar/folio.spec.ts` | List view, date filters, profile info, navigation |
| Profile | `tests/e2e/ar/profile.spec.ts` | CRUD, filters, pagination, actions |
| Invoice | `tests/e2e/ar/invoice.spec.ts` | List view, create form, search/filter |
| Receipt | `tests/e2e/ar/receipt.spec.ts` | List view, create form, void handling |

### AP (Accounts Payable) Module
| Page | Test File | Coverage |
|------|-----------|----------|
| Invoice | `tests/e2e/ap/invoice.spec.ts` | List view, create form, vendor mgmt, formatting |
| Payment | `tests/e2e/ap/payment.spec.ts` | List view, create form, bank/cheque info |

### GL (General Ledger) Module
| Page | Test File | Coverage |
|------|-----------|----------|
| Journal Voucher | `tests/e2e/gl/journal-voucher.spec.ts` | List view, create/edit, prefix, periods |

### Asset Module
| Page | Test File | Coverage |
|------|-----------|----------|
| Register | `tests/e2e/asset/register.spec.ts` | List view, create form, depreciation |

### Infrastructure
| File | Purpose |
|------|---------|
| `tests/e2e/auth.setup.ts` | Login flow, saves auth state |
| `tests/e2e/auth.teardown.ts` | Cleanup after tests |
| `tests/e2e/utils.ts` | Common helpers, test data, selectors |
| `tests/e2e/pages.spec.ts` | Basic smoke tests for all routes |

## Test Statistics

- **Total Test Files**: 10
- **Total Test Cases**: 140+
- **Browsers**: Chromium (configurable for Firefox/WebKit)
- **Features Tested**:
  - Page load verification
  - Data table display
  - Filter controls
  - Pagination
  - CRUD operations (Create, Read, Update)
  - Navigation flows
  - Responsive layout
  - Form validation
  - Empty state handling

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Show report
npm run test:e2e:report
```

## Configuration

- **Config File**: `playwright.config.ts`
- **Base URL**: `http://localhost:5173` (configurable via BASE_URL env var)
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Trace**: Captured on first retry

## Known Issues / TODOs

1. **Authentication**: Tests expect a login page at `/login`. Update `auth.setup.ts` with actual selectors.
2. **API Mocking**: Consider adding MSW (Mock Service Worker) for consistent test data.
3. **Test Data**: Tests currently check for empty state handling; seeded data tests would be more comprehensive.
4. **Edit Pages**: Edit page tests are basic; full form interaction tests could be added.

## Next Steps

1. Ensure dev server is running on port 5173 or set BASE_URL
2. Update `auth.setup.ts` with actual login credentials if needed
3. Run `npx playwright test` to execute tests
4. Review HTML report in `playwright-report/` directory

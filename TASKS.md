# carmen.web-migrate Project Tasks

## 📋 Active Tasks - PHASE 4: Complete All UI Pages

### Frontend UI Agent ⏳ IN PROGRESS
- **Task:** Create/implement all missing UI pages
- **Agent:** `frontend-ui-complete-agent` (4dd5a807-b663-490e-a2a1-d2bf1b517978)
- **Status:** Creating placeholder/implementing pages:
  - GL: RecurringVoucher, TemplateVoucher, AccountSummary, FinancialReport, ChartOfAccounts, Budget
  - Asset: PreAsset, Disposal, Vendor
  - Config: Company, Users, Permissions, Workflow, Settings

### Backend API Agent ⏳ IN PROGRESS  
- **Task:** Fix and verify all API endpoints
- **Agent:** `backend-api-complete-agent` (d02f9b07-df67-404c-9c6b-54f27f6f09e8)
- **Status:** Checking/fixing APIs:
  - GL: glJv, glAllocationJv, glStdJv, glRecurringStdJv, etc.
  - AP: apVendor, apInvoice, apPayment
  - AR: arProfile, arFolio, arInvoice, arReceipt
  - Asset: assetRegister, assetPreAsset, assetDisposal

---

## ✅ COMPLETED PHASES

### Phase 1: Authentication System ✅ DONE
- [x] Backend API integration with Carmen API
- [x] Frontend Login Page with 2-step flow
- [x] Fix Login Next button (validation issue)
- [x] Fix API endpoints (tenant list, login URL)
- [x] Fix Permissions structure (object to string array)
- [x] Fix Authorization header (Bearer format)

### Phase 2: Routing & Navigation ✅ DONE
- [x] Fix redirect loop after login
- [x] Fix auth state persistence (Zustand partialize)
- [x] Add missing routes (29 pages)
- [x] Fix menu click redirect to login

### Phase 3: Testing ✅ DONE
- [x] Playwright login tests passing (12/12)
- [x] All menu items working (74 tests passed)

---

## 📋 REMAINING WORK

### UI Pages Need Implementation:
**GL Module:**
- [ ] RecurringVoucherList/Create
- [ ] TemplateVoucherList/Create
- [ ] AccountSummary
- [ ] FinancialReport
- [ ] ChartOfAccounts
- [ ] Budget

**Asset Module:**
- [ ] AssetPreAsset
- [ ] AssetDisposal
- [ ] AssetVendor

**Config Module:**
- [ ] ConfigCompany
- [ ] ConfigUsers
- [ ] ConfigPermissions
- [ ] ConfigWorkflow
- [ ] ConfigSettings

### API Endpoints Need Verification:
**GL:**
- [ ] /api/glJv/search
- [ ] /api/glAllocationJv/search
- [ ] /api/glStdJv/search
- [ ] /api/glRecurringStdJv/search
- [ ] /api/glAmortizationStdJv/search

**AP:**
- [ ] /api/apVendor/search
- [ ] /api/apInvoice/search
- [ ] /api/apPayment/search

**AR:**
- [ ] /api/arProfile/search
- [ ] /api/arFolio/search
- [ ] /api/arInvoice/search
- [ ] /api/arReceipt/search

**Asset:**
- [ ] /api/assetRegister/search
- [ ] /api/assetPreAsset/search
- [ ] /api/assetDisposal/search

---

## 📅 Scheduled Tasks

### Hourly Progress Reports
- Cron: `0 * * * *`
- Script: `/root/.openclaw/workspace/scripts/progress_report.sh`
- Log: `/tmp/cron_progress.log`

## 🔧 API Configuration

### Carmen API
- **Base URL**: https://dev.carmen4.com/Carmen.api
- **Swagger UI**: https://dev.carmen4.com/Carmen.api/swagger/ui/index
- **Admin Token**: `f9ebce3d77f2f445dee52ba252cc53ee`

### Login Credentials
```json
{
  "Tenant": "dev",
  "UserName": "admin",
  "Password": "alpha"
}
```

## 👥 Current Agent Assignments

| Agent | Task | Session Key | Status |
|-------|------|-------------|--------|
| frontend-ui-complete-agent | Complete UI Pages | 4dd5a807-b663-490e-a2a1-d2bf1b517978 | 🟡 Active |
| backend-api-complete-agent | Fix All APIs | d02f9b07-df67-404c-9c6b-54f27f6f09e8 | 🟡 Active |

## 📝 Notes

- Project location: `/root/.openclaw/workspace/projects/carmen.web-migrate`
- Build command: `npm run build`
- Test command: `npx playwright test`
- All agents coordinated by: **นาโน** 💕

Last Updated: 2025-04-02 16:15 GMT+7

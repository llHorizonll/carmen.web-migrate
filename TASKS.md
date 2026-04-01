# Carmen.Web Migration - Task Assignments

This file coordinates the multi-agent migration effort for Carmen.Web.

## Project Overview
- **Technology Stack**: React 18 + TypeScript + Mantine 8 + TanStack Query 5 + TanStack Table 8
- **Build Tool**: Vite 6
- **Timeline**: 10 weeks (Hybrid approach)
- **Source**: `projects/carmen.web-old` (React 17, JS, MUI v4, react-admin v3)
- **Target**: `projects/carmen.web-migrate` (Current directory)

---

## Phase 1: Foundation (Week 1)

### TASK-001: Project Setup ✅ COMPLETED
**Agent**: Foundation Lead
**Status**: Done
**Deliverables**:
- [x] Vite 6 project with TypeScript 5.8
- [x] Mantine 8.3.18 installed
- [x] TanStack Query 5.90.7 installed
- [x] TanStack Table 8.21.2 installed
- [x] Path aliases configured
- [x] ESLint + Prettier configured
- [x] PostCSS configured for Mantine

### TASK-002: Create Skills ✅ COMPLETED
**Agent**: DevEx Lead
**Status**: Done
**Deliverables**:
- [x] `.agents/skills/carmen-mantine-patterns/SKILL.md`
- [x] `.agents/skills/tanstack-table-patterns/SKILL.md`
- [x] `.agents/skills/tanstack-query-patterns/SKILL.md`

### TASK-003: Type Definitions ✅ COMPLETED
**Agent**: Foundation Lead
**Status**: Done
**Deliverables**:
- [x] `src/types/models.ts` - All domain models
- [x] `src/types/api.ts` - API request/response types
- [x] `src/types/components.ts` - Component prop types

### TASK-004: Core Utilities ✅ COMPLETED
**Agent**: Foundation Lead
**Status**: Done
**Deliverables**:
- [x] `src/utils/constants.ts` - Permissions
- [x] `src/utils/formatter.ts` - Date/number formatting
- [x] `src/utils/request.ts` - Axios configuration
- [x] `src/lib/queryClient.ts` - TanStack Query client
- [x] `src/lib/mantine.ts` - Theme configuration

### TASK-005: Layout System ✅ COMPLETED
**Agent**: Layout Lead
**Status**: Done
**Deliverables**:
- [x] `src/layout/AppShell.tsx` - Main layout
- [x] `src/layout/NavbarMenu.tsx` - Navigation menu
- [x] `src/layout/UserMenu.tsx` - User dropdown
- [ ] `src/layout/ErrorDashboard.tsx` - Error display (optional)

---

## Phase 2: Core Components (Week 1-2)

### TASK-006: UI Components
**Agent**: UI Lead / Frontend Agent
**Status**: Not Started
**Dependencies**: TASK-001, TASK-002
**Deliverables**:
- [ ] `src/components/ui/DataTable.tsx` - List view table (TanStack Table)
- [ ] `src/components/ui/InlineTable.tsx` - Detail editing table
- [ ] `src/components/ui/Form/` - Form input components
- [ ] `src/components/ui/ActionMenu.tsx` - Action dropdown menu
- [ ] `src/components/ui/StatusBadge.tsx` - Status indicators
- [ ] `src/components/ui/FilterPanel.tsx` - Search/filter panel

### TASK-007: Dialog Components
**Agent**: UI Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/components/DialogJVDetail.tsx`
- [ ] `src/components/DialogViewAPInvoice.tsx`
- [ ] `src/components/DialogViewARInvoice.tsx`
- [ ] `src/components/DialogExportCSV.tsx`
- [ ] `src/components/DialogWorkflowHis.tsx`

---

## Phase 3: Services & Hooks (Week 2) ✅ COMPLETED

### TASK-008: API Services ✅
**Agent**: API Lead / Backend Agent
**Status**: Done
**Deliverables**:
- [x] `src/services/generalLedger.ts` - GL services
- [x] `src/services/accountPayable.ts` - AP services
- [x] `src/services/accountReceivable.ts` - AR services
- [x] `src/services/asset.ts` - Asset services
- [ ] `src/services/user.ts` - User/auth services (optional)

### TASK-009: React Query Hooks ✅
**Agent**: API Lead / Backend Agent
**Status**: Done
**Deliverables**:
- [x] `src/hooks/useJournalVoucher.ts`
- [x] `src/hooks/useAllocationVoucher.ts`
- [x] `src/hooks/useApInvoice.ts`
- [x] `src/hooks/useApPayment.ts`
- [x] `src/hooks/useArInvoice.ts`
- [x] `src/hooks/useArReceipt.ts`
- [x] `src/hooks/useArProfile.ts`
- [x] `src/hooks/useAsset.ts`

---

## Phase 4: GL Module (Week 3-4)

### TASK-010: Journal Voucher
**Agent**: GL Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/gl/journal-voucher/List.tsx`
- [ ] `src/pages/gl/journal-voucher/Create.tsx`
- [ ] `src/pages/gl/journal-voucher/Edit.tsx`
- [ ] Route: `/gl/journal-voucher`

### TASK-011: Allocation Voucher
**Agent**: GL Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/gl/allocation-voucher/List.tsx`
- [ ] `src/pages/gl/allocation-voucher/Create.tsx`
- [ ] `src/pages/gl/allocation-voucher/Edit.tsx`

### TASK-012: Other GL Modules
**Agent**: GL Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] Template Voucher (StdVoucher)
- [ ] Recurring Voucher
- [ ] Amortization Voucher
- [ ] Account Summary
- [ ] Financial Report
- [ ] Chart of Accounts
- [ ] Budget

---

## Phase 5: AP Module (Week 5-6)

### TASK-013: AP Invoice
**Agent**: AP Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ap/invoice/List.tsx`
- [ ] `src/pages/ap/invoice/Create.tsx`
- [ ] `src/pages/ap/invoice/Edit.tsx`

### TASK-014: AP Payment
**Agent**: AP Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ap/payment/List.tsx`
- [ ] `src/pages/ap/payment/Create.tsx`
- [ ] `src/pages/ap/payment/Edit.tsx`

### TASK-015: AP Vendor
**Agent**: AP Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ap/vendor/List.tsx`
- [ ] `src/pages/ap/vendor/Create.tsx`
- [ ] `src/pages/ap/vendor/Edit.tsx`

---

## Phase 6: AR Module (Week 6-7)

### TASK-016: AR Profile
**Agent**: AR Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ar/profile/List.tsx`
- [ ] `src/pages/ar/profile/Create.tsx`
- [ ] `src/pages/ar/profile/Edit.tsx`

### TASK-017: AR Invoice
**Agent**: AR Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ar/invoice/List.tsx`
- [ ] `src/pages/ar/invoice/Create.tsx`
- [ ] `src/pages/ar/invoice/Edit.tsx`

### TASK-018: AR Receipt
**Agent**: AR Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ar/receipt/List.tsx`
- [ ] `src/pages/ar/receipt/Create.tsx`
- [ ] `src/pages/ar/receipt/Edit.tsx`

### TASK-019: AR Folio
**Agent**: AR Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/ar/folio/List.tsx`
- [ ] `src/pages/ar/folio/Show.tsx`

---

## Phase 7: Asset Module (Week 7-8)

### TASK-020: Asset Register
**Agent**: Asset Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/pages/asset/register/List.tsx`
- [ ] `src/pages/asset/register/Create.tsx`
- [ ] `src/pages/asset/register/Edit.tsx`

### TASK-021: Other Asset Modules
**Agent**: Asset Lead / Frontend Agent
**Status**: Not Started
**Deliverables**:
- [ ] Pre-Asset
- [ ] Asset Disposal
- [ ] Asset Vendor
- [ ] Procedures

---

## Phase 8: DevOps & Infrastructure (Week 3-4) ✅ COMPLETED

### TASK-022: Docker Setup ✅
**Agent**: DevOps Agent
**Status**: Done
**Deliverables**:
- [x] `Dockerfile` - Production build
- [x] `Dockerfile.dev` - Development
- [x] `docker-compose.yml` - Dev stack
- [x] `docker-compose.prod.yml` - Production
- [x] `nginx.conf` - Web server config

### TASK-023: CI/CD Pipeline ✅
**Agent**: DevOps Agent
**Status**: Done
**Deliverables**:
- [x] `.github/workflows/ci-cd.yml`
- [x] `.github/workflows/pr-checks.yml`

### TASK-024: Deployment Configs ✅
**Agent**: DevOps Agent
**Status**: Done
**Deliverables**:
- [x] `vercel.json`
- [x] `netlify.toml`
- [x] `Makefile`

---

## Phase 9: Testing & QA (Week 8-9)

### TASK-025: Test Suite
**Agent**: QA Lead / QA Agent
**Status**: Not Started
**Deliverables**:
- [ ] `src/__tests__/unit/utils/formatter.test.ts`
- [ ] `src/__tests__/unit/utils/permissions.test.ts`
- [ ] `src/__tests__/integration/gl/journalVoucher.test.tsx`
- [ ] `src/__tests__/integration/ap/apInvoice.test.tsx`
- [ ] `src/__tests__/integration/ar/arReceipt.test.tsx`
- [ ] Test coverage > 70%

### TASK-026: Performance Testing
**Agent**: QA Lead / QA Agent
**Status**: Not Started
**Deliverables**:
- [ ] Table with 10k rows scrolls at 60fps
- [ ] Table with 100k rows uses virtualization
- [ ] Memory usage stable
- [ ] Load time < 2s

---

## Phase 10: Final Polish (Week 9-10)

### TASK-027: Documentation
**Agent**: All Leads / PM Agent
**Status**: In Progress
**Deliverables**:
- [x] `README.md` - Project overview
- [x] `DEVOPS.md` - DevOps guide (by DevOps Agent)
- [ ] API compatibility report
- [ ] Migration guide
- [ ] Performance comparison

### TASK-028: Bug Fixes & Optimization
**Agent**: All Leads
**Status**: Not Started
**Deliverables**:
- [ ] All critical bugs resolved
- [ ] Performance optimized
- [ ] Accessibility verified

---

## Task Template

```markdown
# TASK-XXX: Task Name

## Assigned Agent
Agent Name

## Status
Not Started | In Progress | Done

## Dependencies
- List of dependent tasks

## Description
Detailed description of what needs to be done

## Deliverables
- [ ] File/path to create
- [ ] Functionality to implement

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Reference Files
- Original: `projects/carmen.web-old/src/...`
- New: `src/...`

## Notes
Any additional notes
```

---

## Quick Links

- **Original Source (Legacy)**: `projects/carmen.web-old`
- **Target Directory (This Project)**: `projects/carmen.web-migrate`
- **Task Tracking**: `TASKS.md` (This file)
- **DevOps Guide**: `DEVOPS.md`

# Carmen.Web Migration Progress

## Completed Foundation Work

### ✅ Project Setup (TASK-001)
- Vite 6.2.3 with TypeScript 5.8.2
- React 18.3.1 + React DOM 18.3.1
- All latest packages installed:
  - Mantine 8.3.18 (core, dates, form, hooks, modals, notifications, spotlight)
  - TanStack Query 5.90.7
  - TanStack Table 8.21.2
  - TanStack Virtual 3.13.6
  - React Router 7.4.0
  - Zod 3.24.2
  - Zustand 5.0.3
  - Vitest 3.0.9

### ✅ Task Management (TASK-002)
- Created `TASKS.md` with detailed task assignments
- Defined 25+ tasks across 9 phases
- Agent role assignments documented

### ✅ Skills Creation (TASK-003)
Created 3 skill files in `.agents/skills/`:
1. **carmen-mantine-patterns** - Mantine 8.x patterns for accounting UI
2. **tanstack-table-patterns** - High-performance table patterns
3. **tanstack-query-patterns** - Server state management patterns

### ✅ Type System (TASK-004)
Created comprehensive TypeScript types:
- `src/types/models.ts` - 40+ domain models (GL, AP, AR, Asset)
- `src/types/api.ts` - API request/response types
- `src/types/components.ts` - Component prop types

### ✅ Core Infrastructure (TASK-005)
- `src/lib/mantine.ts` - Mantine theme configuration
- `src/lib/queryClient.ts` - TanStack Query client
- `src/lib/router.tsx` - React Router 7 setup
- `src/utils/constants.ts` - Permission constants
- `src/utils/formatter.ts` - Date/number formatting
- `src/utils/request.ts` - Axios configuration

### ✅ Layout System
- `src/layout/AppShell.tsx` - Main layout with Mantine AppShell
- `src/layout/NavbarMenu.tsx` - Navigation with permissions
- `src/layout/UserMenu.tsx` - User dropdown menu

### ✅ API Services (Partial)
- `src/services/generalLedger.ts` - GL API services (complete)
- `src/hooks/useJournalVoucher.ts` - TanStack Query hooks (complete)

### ✅ Components
- `src/components/ErrorBoundary.tsx` - Error handling

## Project Structure

```
src/
├── components/
│   ├── ui/              # UI components (to be built)
│   └── ErrorBoundary.tsx
├── hooks/
│   └── useJournalVoucher.ts
├── lib/
│   ├── mantine.ts       # Theme config
│   ├── queryClient.ts   # Query client
│   └── router.tsx       # Router setup
├── layout/
│   ├── AppShell.tsx
│   ├── NavbarMenu.tsx
│   └── UserMenu.tsx
├── pages/               # To be populated
├── providers/           # To be populated
├── services/
│   └── generalLedger.ts
├── types/
│   ├── api.ts
│   ├── components.ts
│   └── models.ts
├── utils/
│   ├── constants.ts
│   ├── formatter.ts
│   └── request.ts
└── main.tsx
```

## Next Steps for Sub-Agents

### Phase 1: Core Components (Week 1-2)

**UI Lead** should build:
- `src/components/ui/DataTable.tsx` - List view table
- `src/components/ui/InlineTable.tsx` - Detail editing table
- `src/components/ui/ActionMenu.tsx` - Action dropdown
- `src/components/ui/StatusBadge.tsx` - Status indicators
- `src/components/ui/FilterPanel.tsx` - Search/filter panel

**API Lead** should build:
- `src/services/accountPayable.ts`
- `src/services/accountReceivable.ts`
- `src/services/asset.ts`
- Corresponding TanStack Query hooks

### Phase 2: GL Module (Week 3-4)

**GL Lead** should build:
- `src/pages/gl/journal-voucher/List.tsx`
- `src/pages/gl/journal-voucher/Create.tsx`
- `src/pages/gl/journal-voucher/Edit.tsx`
- All other GL modules

### Phase 3-5: AP, AR, Asset Modules (Weeks 5-8)

**AP Lead**, **AR Lead**, **Asset Lead** build their respective modules following the patterns established.

### Phase 6: Testing (Weeks 8-10)

**QA Lead** should:
- Set up test infrastructure
- Write unit tests for utilities
- Write integration tests for critical flows
- Verify API compatibility

## Key Technical Decisions

### Why This Stack?

| Technology | Version | Reason |
|------------|---------|--------|
| Mantine | 8.3.18 | Latest, modular, 100+ components |
| TanStack Table | 8.21.2 | Virtualized, handles 100k+ rows |
| TanStack Query | 5.90.7 | Caching, background updates |
| Vite | 6.2.3 | Fast HMR, optimal builds |
| React Router | 7.4.0 | Latest with data APIs |

### Performance Optimizations

1. **Table Virtualization** - Only render visible rows
2. **Code Splitting** - Separate chunks for vendors
3. **TanStack Query** - Automatic caching and background updates
4. **Tree Shaking** - Import only used components

### API Compatibility

All API services preserve the exact same:
- Endpoint URLs
- Request/response formats
- Error handling behavior
- Authentication flow

## Testing the Setup

```bash
# Install dependencies (if not done)
npm install

# Run type checking
npm run type-check

# Start dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Known Issues & Notes

1. **React 19 Warning** - Some peer dependency warnings due to React 19, but functionality works
2. **Icons** - Using Tabler Icons (@tabler/icons-react)
3. **Date Handling** - Using date-fns v4
4. **Form Validation** - Using Zod + Mantine Form

## Recommendations for New Features

### 1. Real-time Updates
Add WebSocket for live notifications when other users modify data.

### 2. Offline Support
Use service workers to queue mutations when offline.

### 3. Keyboard Shortcuts
Add Excel-like keyboard navigation (Ctrl+S save, arrow keys navigate cells).

### 4. Advanced Filtering
Save filter presets, complex filter builder UI.

### 5. Bulk Operations
Multi-select in tables, bulk approve/post/void operations.

### 6. Dashboard Widgets
Draggable dashboard with customizable widgets.

## Migration Checklist

- [x] Project foundation
- [x] Type definitions
- [x] API services (GL complete, others pending)
- [x] Core layout
- [ ] UI components
- [ ] GL Module
- [ ] AP Module
- [ ] AR Module
- [ ] Asset Module
- [ ] Testing
- [ ] Documentation
- [ ] Performance optimization

## Agent Assignment Summary

| Agent | Tasks | Current Status |
|-------|-------|----------------|
| Foundation Lead | 001, 003, 004 | ✅ Complete |
| UI Lead | 002, 006 | 🔄 Ready to start |
| API Lead | 008, 009 | 🔄 Ready to start |
| GL Lead | 010, 011, 012 | ⏳ Pending |
| AP Lead | 013, 014, 015 | ⏳ Pending |
| AR Lead | 016, 017, 018, 019 | ⏳ Pending |
| Asset Lead | 020, 021 | ⏳ Pending |
| QA Lead | 022, 023 | ⏳ Pending |

## Estimated Timeline Remaining

- **Week 1-2**: Core components + Services
- **Week 3-4**: GL Module
- **Week 5-6**: AP + AR Modules
- **Week 7-8**: Asset + Config
- **Week 9-10**: Testing + Polish

---

**Project Location**: `C:\source\carmen.web-migrate`
**Source Reference**: `C:\source\carmen.web`
**Plan Document**: `C:\Users\thago\.kimi\plans\wolverine-hulk-wonder-woman.md`

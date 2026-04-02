# Carmen.Web Migration 🚀

> **Modernizing Accounting ERP System**  
> From legacy React 17 (JavaScript) → React 18 (TypeScript) with modern tech stack

---

## 📋 Project Overview

This project is a migration of the **Carmen Accounting ERP System** from legacy codebase to a modern, maintainable, and scalable architecture.

| Aspect | Legacy (carmen.web-old) | Modern (carmen.web-migrate) |
|--------|------------------------|----------------------------|
| **Framework** | React 17 | React 18 |
| **Language** | JavaScript | TypeScript 5.8 |
| **Build Tool** | Create React App | Vite 6 |
| **UI Library** | MUI v4 | Mantine 8 |
| **State Management** | Redux | Zustand + TanStack Query |
| **Data Grid** | react-admin v3 | TanStack Table 8 |
| **Routing** | React Router v5 | React Router 7 |

---

## 🛠️ Tech Stack

### Core
- **React 18.3** - UI Library
- **TypeScript 5.8** - Type Safety
- **Vite 6** - Build Tool & Dev Server

### UI & Styling
- **Mantine 8.3** - Component Library
  - @mantine/core, @mantine/dates, @mantine/form
  - @mantine/modals, @mantine/notifications
- **Tabler Icons** - Icon Library

### State Management
- **TanStack Query 5** - Server State (API caching)
- **Zustand 5** - Client State (UI state)

### Data & Utilities
- **TanStack Table 8** - Data Tables with virtualization
- **Axios** - HTTP Client
- **Zod** - Schema Validation
- **date-fns** - Date manipulation

### Testing
- **Vitest** - Unit Testing
- **React Testing Library** - Component Testing
- **Playwright** - E2E Testing ⭐ NEW
- **jsdom** - DOM Environment

### DevOps & Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD Pipeline
- **Nginx** - Production Web Server

---

## 📁 Project Structure

```
carmen.web-migrate/
├── .agents/                    # Agent skills and patterns
│   └── skills/
│       ├── carmen-mantine-patterns/
│       ├── tanstack-query-patterns/
│       └── tanstack-table-patterns/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
├── monitoring/                 # Prometheus, Grafana configs
├── scripts/                    # Deployment scripts
├── src/
│   ├── assets/                 # Static assets
│   ├── components/             # React components
│   │   ├── ui/                 # UI components (DataTable, etc.)
│   │   └── Dialog*.tsx         # Dialog components
│   ├── hooks/                  # React Query hooks
│   │   ├── useJournalVoucher.ts
│   │   ├── useApInvoice.ts
│   │   ├── useArInvoice.ts
│   │   └── ...
│   ├── layout/                 # App layout components
│   │   ├── AppShell.tsx
│   │   ├── NavbarMenu.tsx
│   │   └── UserMenu.tsx
│   ├── lib/                    # Library configs
│   │   ├── mantine.ts
│   │   ├── queryClient.ts
│   │   └── router.tsx
│   ├── pages/                  # Page components (by module)
│   │   ├── gl/                 # General Ledger
│   │   │   ├── journal-voucher/
│   │   │   ├── allocation-voucher/
│   │   │   └── ...
│   │   ├── ap/                 # Accounts Payable
│   │   │   ├── invoice/
│   │   │   ├── payment/
│   │   │   └── vendor/
│   │   ├── ar/                 # Accounts Receivable
│   │   │   ├── profile/
│   │   │   ├── invoice/
│   │   │   ├── receipt/
│   │   │   └── folio/
│   │   └── asset/              # Asset Management
│   │       └── register/
│   ├── services/               # API service functions
│   │   ├── generalLedger.ts
│   │   ├── accountPayable.ts
│   │   ├── accountReceivable.ts
│   │   └── asset.ts
│   ├── types/                  # TypeScript definitions
│   │   ├── models.ts           # Domain models
│   │   ├── api.ts              # API types
│   │   └── components.ts       # Component props
│   └── utils/                  # Utility functions
│       ├── constants.ts
│       ├── formatter.ts
│       └── request.ts
├── tests/                      # Test files
├── Dockerfile                  # Production Docker
├── Dockerfile.dev              # Development Docker
├── docker-compose.yml          # Docker Compose
├── Makefile                    # Convenience commands
├── TASKS.md                    # Task tracking
├── DEVOPS.md                   # DevOps documentation
└── README.md                   # This file
```

---

## 🤖 Agent Swarm

This project uses an **Agent Swarm** architecture where specialized AI agents handle different aspects of development:

| Agent | Role | Status | Responsibilities |
|-------|------|--------|------------------|
| 🎨 **Frontend Agent** | UI/UX Development | 🟢 Ready | Components, Pages, Forms, Styling |
| ⚙️ **Backend Agent** | API & Data Layer | ✅ **Completed** | Services, React Query Hooks, API Integration |
| 🚀 **DevOps Agent** | Infrastructure | ✅ **Completed** | Docker, CI/CD, Deployment, Monitoring |
| 🧪 **QA Agent** | Quality Assurance | 🟢 Ready | Testing, Code Review, Bug Reports |
| 📋 **PM Agent** | Project Management | 🟢 Ready | Task coordination, Progress tracking |

### How to Work with Agents

Simply tell **Nano** (นาโน) what you need, and she will coordinate with the appropriate agents:

> **Examples:**
> - "ให้ Frontend Agent สร้าง DataTable component"
> - "ให้ PM Agent วางแผนทำ GL Journal Voucher pages"
> - "ให้ QA Agent เขียน test สำหรับ AP Invoice"
> - "Deploy ขึ้น staging"

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm or yarn
- Docker (optional, for containerized development)

### Installation

```bash
# Clone or navigate to project
cd projects/carmen.web-migrate

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (Vite)
make dev                 # Same as above
make dev-docker          # Run with Docker

# Build
npm run build            # Build for production
make build               # Same as above
npm run preview          # Preview production build

# Testing
npm run test             # Run tests (Vitest)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking

# Docker
make docker-build        # Build Docker image
make docker-prod         # Run production locally
make monitoring-up       # Start Prometheus + Grafana

# Deployment
make deploy-staging      # Deploy to staging
make deploy-prod         # Deploy to production
```

---

## 📊 Current Status

### ✅ Completed Phases

**Phase 1: Foundation**
- ✅ Project Setup (Vite, TypeScript, Mantine)
- ✅ Skills Created (3 agent skill files)
- ✅ Type Definitions (40+ domain models)
- ✅ Core Utilities (formatters, request, constants)
- ✅ Layout System (AppShell, Navbar, UserMenu)

**Phase 3: Services & Hooks**
- ✅ API Services (GL, AP, AR, Asset)
- ✅ React Query Hooks (JournalVoucher, AP, AR, Asset)

**Phase 8: DevOps**
- ✅ Docker Setup (dev & production)
- ✅ CI/CD Pipeline (GitHub Actions)
- ✅ Deployment Configs (Vercel, Netlify)

### 🚧 In Progress / Pending

**Phase 2: Core Components**
- ⏳ DataTable (TanStack Table)
- ⏳ Form Components
- ⏳ Dialog Components

**Phase 4-7: Modules**
- ⏳ GL: Journal Voucher, Allocation Voucher
- ⏳ AP: Invoice, Payment, Vendor
- ⏳ AR: Profile, Invoice, Receipt, Folio
- ⏳ Asset: Register

**Phase 9: Testing**
- ⏳ Unit Tests
- ⏳ Integration Tests
- ⏳ Performance Testing

---

## 🏗️ Domain Modules

### Authentication System ⭐ NEW
- **Login Page** - Modern Mantine UI with form validation
- **Auth Context** - Global authentication state management
- **Protected Routes** - Route guards for authenticated access
- **API Integration** - Carmen API with JWT token handling

### 1. General Ledger (GL)
- Journal Voucher
- Allocation Voucher
- Standard Voucher / Template
- Recurring Voucher
- Amortization Voucher
- Chart of Accounts
- Budget

### 2. Accounts Payable (AP)
- AP Invoice
- AP Payment
- AP Vendor
- AP Aging Report

### 3. Accounts Receivable (AR)
- AR Profile
- AR Invoice
- AR Receipt
- AR Folio (Statement)
- AR Aging Report

### 4. Asset Management
- Asset Register
- Asset Depreciation
- Asset Disposal
- Asset Transfer

---

## 📚 Documentation

- **[TASKS.md](TASKS.md)** - Detailed task assignments and progress tracking
- **[DEVOPS.md](DEVOPS.md)** - DevOps guide, Docker usage, deployment instructions

---

## 🔗 Quick Links

- **Legacy Code**: `projects/carmen.web-old`
- **Current Project**: `projects/carmen.web-migrate`
- **Original Migration Plan**: See `TASKS.md`

---

## 📝 Notes

- This project follows **strict TypeScript** practices
- All API calls use **TanStack Query** for caching and state management
- UI components are built with **Mantine** for consistency
- **Agent Swarm** is used for development - coordinate through Nano

---

<p align="center">
  <strong>Powered by Agent Swarm 🤖 | Built with Modern Stack ⚡</strong>
</p>

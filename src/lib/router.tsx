import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from '../layout/AppShell';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';

// Placeholder pages - will be replaced with actual implementations
const Dashboard = () => <div>Dashboard</div>;

// GL Module - Journal Voucher
import JournalVoucherList from '../pages/gl/journal-voucher/List';
import JournalVoucherCreate from '../pages/gl/journal-voucher/Create';
import JournalVoucherEdit from '../pages/gl/journal-voucher/Edit';

// GL Module - Allocation Voucher
import AllocationVoucherList from '../pages/gl/allocation-voucher/List';
import AllocationVoucherCreate from '../pages/gl/allocation-voucher/Create';
import AllocationVoucherEdit from '../pages/gl/allocation-voucher/Edit';

// GL Module - Amortization Voucher
import AmortizationVoucherList from '../pages/gl/amortization-voucher/List';
import AmortizationVoucherCreate from '../pages/gl/amortization-voucher/Create';
import AmortizationVoucherEdit from '../pages/gl/amortization-voucher/Edit';

// GL Module - Standard Voucher
import StandardVoucherList from '../pages/gl/standard-voucher/List';
import StandardVoucherCreate from '../pages/gl/standard-voucher/Create';
import StandardVoucherEdit from '../pages/gl/standard-voucher/Edit';

// GL Module - Recurring Voucher
import RecurringVoucherList from '../pages/gl/recurring-voucher/List';
import RecurringVoucherCreate from '../pages/gl/recurring-voucher/Create';

// GL Module - Template Voucher
import TemplateVoucherList from '../pages/gl/template-voucher/List';
import TemplateVoucherCreate from '../pages/gl/template-voucher/Create';

// GL Module - Account Summary
import AccountSummary from '../pages/gl/account-summary';

// GL Module - Financial Report
import FinancialReport from '../pages/gl/financial-report';

// GL Module - Chart of Accounts
import ChartOfAccounts from '../pages/gl/chart-of-accounts';

// GL Module - Budget
import Budget from '../pages/gl/budget';

// AP Module - Vendor
import APVendorList from '../pages/ap/vendor/List';
import APVendorCreate from '../pages/ap/vendor/Create';
import APVendorEdit from '../pages/ap/vendor/Edit';

// AP Module - Invoice
import APInvoiceList from '../pages/ap/invoice/List';
import APInvoiceCreate from '../pages/ap/invoice/Create';
import APInvoiceEdit from '../pages/ap/invoice/Edit';

// AP Module - Payment
import APPaymentList from '../pages/ap/payment/List';
import APPaymentCreate from '../pages/ap/payment/Create';
import APPaymentEdit from '../pages/ap/payment/Edit';

// AR Module - Profile
import ARProfileList from '../pages/ar/profile/List';
import ARProfileCreate from '../pages/ar/profile/Create';
import ARProfileEdit from '../pages/ar/profile/Edit';

// AR Module - Folio
import ARFolioPage from '../pages/ar/folio/List';

// AR Module - Invoice
import ARInvoiceList from '../pages/ar/invoice/List';
import ARInvoiceCreate from '../pages/ar/invoice/Create';
import ARInvoiceEdit from '../pages/ar/invoice/Edit';

// AR Module - Receipt
import ARReceiptList from '../pages/ar/receipt/List';
import ARReceiptCreate from '../pages/ar/receipt/Create';
import ARReceiptEdit from '../pages/ar/receipt/Edit';

// Asset Module - Register
import AssetRegisterList from '../pages/asset/register/List';
import AssetRegisterCreate from '../pages/asset/register/Create';
import AssetRegisterEdit from '../pages/asset/register/Edit';

// Asset Module - Pre-Asset
import AssetPreAsset from '../pages/asset/pre-asset';

// Asset Module - Disposal
import AssetDisposal from '../pages/asset/disposal';

// Asset Module - Vendor
import AssetVendor from '../pages/asset/vendor';

// Config Module - Company
import ConfigCompany from '../pages/config/company';

// Config Module - Users
import ConfigUsers from '../pages/config/users';

// Config Module - Permissions
import ConfigPermissions from '../pages/config/permissions';

// Config Module - Workflow
import ConfigWorkflow from '../pages/config/workflow';

// Config Module - Settings
import ConfigSettings from '../pages/config/settings';

// Wrapper component with ErrorBoundary
const withErrorBoundary = (Component: React.ComponentType) => (
  <ErrorBoundary>
    <Component />
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withErrorBoundary(Login),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: withErrorBoundary(Dashboard),
          },
          // GL Module - Journal Voucher
          {
            path: 'gl/journal-voucher',
            children: [
              { index: true, element: withErrorBoundary(JournalVoucherList) },
              { path: 'new', element: withErrorBoundary(JournalVoucherCreate) },
              { path: ':id', element: withErrorBoundary(JournalVoucherEdit) },
            ],
          },
          // GL Module - Allocation Voucher
          {
            path: 'gl/allocation-voucher',
            children: [
              { index: true, element: withErrorBoundary(AllocationVoucherList) },
              { path: 'new', element: withErrorBoundary(AllocationVoucherCreate) },
              { path: ':id', element: withErrorBoundary(AllocationVoucherEdit) },
            ],
          },
          // GL Module - Amortization Voucher
          {
            path: 'gl/amortization-voucher',
            children: [
              { index: true, element: withErrorBoundary(AmortizationVoucherList) },
              { path: 'new', element: withErrorBoundary(AmortizationVoucherCreate) },
              { path: ':id', element: withErrorBoundary(AmortizationVoucherEdit) },
            ],
          },
          // GL Module - Standard Voucher
          {
            path: 'gl/standard-voucher',
            children: [
              { index: true, element: withErrorBoundary(StandardVoucherList) },
              { path: 'new', element: withErrorBoundary(StandardVoucherCreate) },
              { path: ':id', element: withErrorBoundary(StandardVoucherEdit) },
            ],
          },
          // GL Module - Recurring Voucher
          {
            path: 'gl/recurring-voucher',
            children: [
              { index: true, element: withErrorBoundary(RecurringVoucherList) },
              { path: 'new', element: withErrorBoundary(RecurringVoucherCreate) },
            ],
          },
          // GL Module - Template Voucher
          {
            path: 'gl/template-voucher',
            children: [
              { index: true, element: withErrorBoundary(TemplateVoucherList) },
              { path: 'new', element: withErrorBoundary(TemplateVoucherCreate) },
            ],
          },
          // GL Module - Account Summary
          {
            path: 'gl/account-summary',
            element: withErrorBoundary(AccountSummary),
          },
          // GL Module - Financial Report
          {
            path: 'gl/financial-report',
            element: withErrorBoundary(FinancialReport),
          },
          // GL Module - Chart of Accounts
          {
            path: 'gl/chart-of-accounts',
            element: withErrorBoundary(ChartOfAccounts),
          },
          // GL Module - Budget
          {
            path: 'gl/budget',
            element: withErrorBoundary(Budget),
          },
          // AP Module - Vendor
          {
            path: 'ap/vendor',
            children: [
              { index: true, element: withErrorBoundary(APVendorList) },
              { path: 'new', element: withErrorBoundary(APVendorCreate) },
              { path: ':id', element: withErrorBoundary(APVendorEdit) },
            ],
          },
          // AP Module - Invoice
          {
            path: 'ap/invoice',
            children: [
              { index: true, element: withErrorBoundary(APInvoiceList) },
              { path: 'new', element: withErrorBoundary(APInvoiceCreate) },
              { path: ':id', element: withErrorBoundary(APInvoiceEdit) },
            ],
          },
          // AP Module - Payment
          {
            path: 'ap/payment',
            children: [
              { index: true, element: withErrorBoundary(APPaymentList) },
              { path: 'new', element: withErrorBoundary(APPaymentCreate) },
              { path: ':id', element: withErrorBoundary(APPaymentEdit) },
            ],
          },
          // AR Module - Profile
          {
            path: 'ar/profile',
            children: [
              { index: true, element: withErrorBoundary(ARProfileList) },
              { path: 'new', element: withErrorBoundary(ARProfileCreate) },
              { path: ':id', element: withErrorBoundary(ARProfileEdit) },
            ],
          },
          // AR Module - Folio
          {
            path: 'ar/folio',
            element: withErrorBoundary(ARFolioPage),
          },
          // AR Module - Invoice
          {
            path: 'ar/invoice',
            children: [
              { index: true, element: withErrorBoundary(ARInvoiceList) },
              { path: 'new', element: withErrorBoundary(ARInvoiceCreate) },
              { path: ':id', element: withErrorBoundary(ARInvoiceEdit) },
            ],
          },
          // AR Module - Receipt
          {
            path: 'ar/receipt',
            children: [
              { index: true, element: withErrorBoundary(ARReceiptList) },
              { path: 'new', element: withErrorBoundary(ARReceiptCreate) },
              { path: ':id', element: withErrorBoundary(ARReceiptEdit) },
            ],
          },
          // Asset Module - Register
          {
            path: 'asset/register',
            children: [
              { index: true, element: withErrorBoundary(AssetRegisterList) },
              { path: 'new', element: withErrorBoundary(AssetRegisterCreate) },
              { path: ':id', element: withErrorBoundary(AssetRegisterEdit) },
            ],
          },
          // Asset Module - Pre-Asset
          {
            path: 'asset/pre-asset',
            element: withErrorBoundary(AssetPreAsset),
          },
          // Asset Module - Disposal
          {
            path: 'asset/disposal',
            element: withErrorBoundary(AssetDisposal),
          },
          // Asset Module - Vendor
          {
            path: 'asset/vendor',
            element: withErrorBoundary(AssetVendor),
          },
          // Config Module - Company
          {
            path: 'config/company',
            element: withErrorBoundary(ConfigCompany),
          },
          // Config Module - Users
          {
            path: 'config/users',
            element: withErrorBoundary(ConfigUsers),
          },
          // Config Module - Permissions
          {
            path: 'config/permissions',
            element: withErrorBoundary(ConfigPermissions),
          },
          // Config Module - Workflow
          {
            path: 'config/workflow',
            element: withErrorBoundary(ConfigWorkflow),
          },
          // Config Module - Settings
          {
            path: 'config/settings',
            element: withErrorBoundary(ConfigSettings),
          },
        ],
      },
    ],
  },
]);

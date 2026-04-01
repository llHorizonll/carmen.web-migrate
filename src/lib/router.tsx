import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from '../layout/AppShell';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Placeholder pages - will be replaced with actual implementations
const Dashboard = () => <div>Dashboard</div>;
const JournalVoucherList = () => <div>Journal Voucher List</div>;
const JournalVoucherCreate = () => <div>Journal Voucher Create</div>;
const JournalVoucherEdit = () => <div>Journal Voucher Edit</div>;
const Login = () => <div>Login</div>;

// Allocation Voucher Pages
import AllocationVoucherList from '../pages/gl/allocation-voucher/List';
import AllocationVoucherCreate from '../pages/gl/allocation-voucher/Create';
import AllocationVoucherEdit from '../pages/gl/allocation-voucher/Edit';

// Amortization Voucher Pages
import AmortizationVoucherList from '../pages/gl/amortization-voucher/List';
import AmortizationVoucherCreate from '../pages/gl/amortization-voucher/Create';
import AmortizationVoucherEdit from '../pages/gl/amortization-voucher/Edit';

// Standard Voucher Pages
import StandardVoucherList from '../pages/gl/standard-voucher/List';
import StandardVoucherCreate from '../pages/gl/standard-voucher/Create';
import StandardVoucherEdit from '../pages/gl/standard-voucher/Edit';

// Asset Register Pages
import AssetRegisterList from '../pages/asset/register/List';
import AssetRegisterCreate from '../pages/asset/register/Create';
import AssetRegisterEdit from '../pages/asset/register/Edit';

// Asset Disposal Pages
import AssetDisposalList from '../pages/asset/disposal/List';
import AssetDisposalCreate from '../pages/asset/disposal/Create';
import AssetDisposalEdit from '../pages/asset/disposal/Edit';

// Pre-Asset Pages
import PreAssetList from '../pages/asset/pre-asset/List';
import PreAssetCreate from '../pages/asset/pre-asset/Create';
import PreAssetEdit from '../pages/asset/pre-asset/Edit';

// AP Invoice Pages
import ApInvoiceList from '../pages/ap/invoice/List';
import ApInvoiceCreate from '../pages/ap/invoice/Create';
import ApInvoiceEdit from '../pages/ap/invoice/Edit';

// AP Payment Pages
import ApPaymentList from '../pages/ap/payment/List';
import ApPaymentCreate from '../pages/ap/payment/Create';
import ApPaymentEdit from '../pages/ap/payment/Edit';

// AP Vendor Pages
import ApVendorList from '../pages/ap/vendor/List';
import ApVendorCreate from '../pages/ap/vendor/Create';
import ApVendorEdit from '../pages/ap/vendor/Edit';

// AR Invoice Pages
import ArInvoiceList from '../pages/ar/invoice/List';
import ArInvoiceCreate from '../pages/ar/invoice/Create';
import ArInvoiceEdit from '../pages/ar/invoice/Edit';

// AR Receipt Pages
import ArReceiptList from '../pages/ar/receipt/List';
import ArReceiptCreate from '../pages/ar/receipt/Create';
import ArReceiptEdit from '../pages/ar/receipt/Edit';

// AR Profile Pages
import ArProfileList from '../pages/ar/profile/List';
import ArProfileCreate from '../pages/ar/profile/Create';
import ArProfileEdit from '../pages/ar/profile/Edit';

// AR Folio Page
import ArFolioList from '../pages/ar/folio/List';

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
      // GL Module
      {
        path: 'gl/journal-voucher',
        children: [
          { index: true, element: withErrorBoundary(JournalVoucherList) },
          { path: 'new', element: withErrorBoundary(JournalVoucherCreate) },
          { path: ':id', element: withErrorBoundary(JournalVoucherEdit) },
        ],
      },
      {
        path: 'gl/allocation-voucher',
        children: [
          { index: true, element: withErrorBoundary(AllocationVoucherList) },
          { path: 'new', element: withErrorBoundary(AllocationVoucherCreate) },
          { path: ':id', element: withErrorBoundary(AllocationVoucherEdit) },
        ],
      },
      {
        path: 'gl/amortization-voucher',
        children: [
          { index: true, element: withErrorBoundary(AmortizationVoucherList) },
          { path: 'new', element: withErrorBoundary(AmortizationVoucherCreate) },
          { path: ':id', element: withErrorBoundary(AmortizationVoucherEdit) },
        ],
      },
      {
        path: 'gl/standard-voucher',
        children: [
          { index: true, element: withErrorBoundary(StandardVoucherList) },
          { path: 'new', element: withErrorBoundary(StandardVoucherCreate) },
          { path: ':id', element: withErrorBoundary(StandardVoucherEdit) },
        ],
      },
      // AP Module
      {
        path: 'ap/invoice',
        children: [
          { index: true, element: withErrorBoundary(ApInvoiceList) },
          { path: 'new', element: withErrorBoundary(ApInvoiceCreate) },
          { path: ':id', element: withErrorBoundary(ApInvoiceEdit) },
        ],
      },
      {
        path: 'ap/payment',
        children: [
          { index: true, element: withErrorBoundary(ApPaymentList) },
          { path: 'new', element: withErrorBoundary(ApPaymentCreate) },
          { path: ':id', element: withErrorBoundary(ApPaymentEdit) },
        ],
      },
      {
        path: 'ap/vendor',
        children: [
          { index: true, element: withErrorBoundary(ApVendorList) },
          { path: 'new', element: withErrorBoundary(ApVendorCreate) },
          { path: ':id', element: withErrorBoundary(ApVendorEdit) },
        ],
      },
      // AR Module
      {
        path: 'ar/invoice',
        children: [
          { index: true, element: withErrorBoundary(ArInvoiceList) },
          { path: 'new', element: withErrorBoundary(ArInvoiceCreate) },
          { path: ':id', element: withErrorBoundary(ArInvoiceEdit) },
        ],
      },
      {
        path: 'ar/receipt',
        children: [
          { index: true, element: withErrorBoundary(ArReceiptList) },
          { path: 'new', element: withErrorBoundary(ArReceiptCreate) },
          { path: ':id', element: withErrorBoundary(ArReceiptEdit) },
        ],
      },
      {
        path: 'ar/profile',
        children: [
          { index: true, element: withErrorBoundary(ArProfileList) },
          { path: 'new', element: withErrorBoundary(ArProfileCreate) },
          { path: ':id', element: withErrorBoundary(ArProfileEdit) },
        ],
      },
      {
        path: 'ar/folio',
        children: [
          { index: true, element: withErrorBoundary(ArFolioList) },
        ],
      },
      // Asset Module
      {
        path: 'asset/register',
        children: [
          { index: true, element: withErrorBoundary(AssetRegisterList) },
          { path: 'new', element: withErrorBoundary(AssetRegisterCreate) },
          { path: ':id', element: withErrorBoundary(AssetRegisterEdit) },
        ],
      },
      {
        path: 'asset/disposal',
        children: [
          { index: true, element: withErrorBoundary(AssetDisposalList) },
          { path: 'new', element: withErrorBoundary(AssetDisposalCreate) },
          { path: ':id', element: withErrorBoundary(AssetDisposalEdit) },
        ],
      },
      {
        path: 'asset/pre-asset',
        children: [
          { index: true, element: withErrorBoundary(PreAssetList) },
          { path: 'new', element: withErrorBoundary(PreAssetCreate) },
          { path: ':id', element: withErrorBoundary(PreAssetEdit) },
        ],
      },
      // Configuration routes
    ],
  },
]);

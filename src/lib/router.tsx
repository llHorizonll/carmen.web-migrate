import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from '../layout/AppShell';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Placeholder pages - will be replaced with actual implementations
const Dashboard = () => <div>Dashboard</div>;
const Login = () => <div>Login</div>;

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
    ],
  },
]);

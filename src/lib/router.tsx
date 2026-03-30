import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from '../layout/AppShell';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Placeholder pages - will be replaced with actual implementations
const Dashboard = () => <div>Dashboard</div>;
const JournalVoucherList = () => <div>Journal Voucher List</div>;
const JournalVoucherCreate = () => <div>Journal Voucher Create</div>;
const JournalVoucherEdit = () => <div>Journal Voucher Edit</div>;
const Login = () => <div>Login</div>;

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
      // TODO: Add all other routes
      // AP Module
      // AR Module
      // Asset Module
      // Configuration
    ],
  },
]);

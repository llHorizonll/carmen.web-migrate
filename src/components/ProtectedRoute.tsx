import { Navigate, useLocation, Outlet } from 'react-router';
import { useAuthStore } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * ProtectedRoute - A wrapper component that protects routes requiring authentication.
 * 
 * Usage:
 * 1. As a wrapper component in router configuration:
 *    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
 * 
 * 2. With Outlet for nested routes:
 *    element: <ProtectedRoute />
 *    children: [...nested routes]
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page, saving the attempted URL
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Return children or Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;

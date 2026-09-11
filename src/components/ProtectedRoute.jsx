import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authError } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    const currentPath = encodeURIComponent(location.pathname + location.search);
    return unauthenticatedElement || <Navigate to={`/login?returnTo=${currentPath}`} replace />;
  }

  if (!isAuthenticated) {
    const currentPath = encodeURIComponent(location.pathname + location.search);
    return unauthenticatedElement || <Navigate to={`/login?returnTo=${currentPath}`} replace />;
  }

  return <Outlet />;
}
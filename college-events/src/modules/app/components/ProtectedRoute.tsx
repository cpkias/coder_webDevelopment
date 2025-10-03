import { Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthContext';

export function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: Array<'student'|'organizer'|'admin'> }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

import { useAuth } from '@/modules/auth/AuthContext';

export function RoleGate({ roles, children }: { roles: Array<'student'|'organizer'|'admin'>; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  if (!roles.includes(user.role)) return null;
  return <>{children}</>;
}

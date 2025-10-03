import { useAuth } from '@/modules/auth/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome, {user?.displayName ?? user?.email}.</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Link to="/events" className="border rounded-md p-4">Browse events</Link>
        {user?.role !== 'student' && (
          <Link to="/events/new" className="border rounded-md p-4">Create event</Link>
        )}
      </div>
    </div>
  );
}

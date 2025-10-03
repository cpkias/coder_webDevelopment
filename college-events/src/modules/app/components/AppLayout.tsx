import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthContext';
import { NotificationsBell } from './NotificationsBell';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOutUser } = useAuth();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-brand">College Events</Link>
          <nav className="flex gap-1 items-center">
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                {(user.role === 'organizer' || user.role === 'admin') && (
                  <NavLink to="/events/new" className={navLinkClass}>Create</NavLink>
                )}
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                )}
              </>
            )}
            {!user ? (
              <NavLink to="/login" className={navLinkClass}>Sign in</NavLink>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <NotificationsBell />
                <button className="px-3 py-2 rounded-md text-sm bg-gray-100" onClick={signOutUser}>Sign out</button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-white text-center text-sm text-gray-500 py-4">© {new Date().getFullYear()} College Events</footer>
    </div>
  );
}

import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('../public/Home'));
const Events = lazy(() => import('../events/EventsListPage'));
const EventDetails = lazy(() => import('../events/EventDetailsPage'));
const About = lazy(() => import('../public/About'));
const Contact = lazy(() => import('../public/Contact'));
const Login = lazy(() => import('../auth/LoginPage'));
const Signup = lazy(() => import('../auth/SignupPage'));
const Dashboard = lazy(() => import('../dashboard/DashboardPage'));
const Admin = lazy(() => import('../admin/AdminDashboardPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OrganizerCreate = lazy(() => import('../events/OrganizerEventPage'));
const EditEvent = lazy(() => import('../events/EditEventPage'));
const CalendarPage = lazy(() => import('../events/EventsCalendarPage'));

export function App() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/new" element={<ProtectedRoute roles={['organizer','admin']}><OrganizerCreate /></ProtectedRoute>} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events/:id/edit" element={<ProtectedRoute roles={['organizer','admin']}><EditEvent /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

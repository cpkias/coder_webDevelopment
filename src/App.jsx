/**
 * Main App Component
 * Application routing and layout
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import ProtectedRoute from '@components/auth/ProtectedRoute';

// Pages
import Home from '@pages/Home';
import EventsPage from '@pages/EventsPage';
import EventDetailsPage from '@pages/EventDetailsPage';
import CalendarPage from '@pages/CalendarPage';
import Login from '@components/auth/Login';
import Signup from '@components/auth/Signup';
import CreateEventPage from '@pages/CreateEventPage';
import MyEventsPage from '@pages/MyEventsPage';
import AdminDashboardPage from '@pages/AdminDashboardPage';
import UserManagementPage from '@pages/UserManagementPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes - Organizers */}
            <Route
              path="/events/create"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:eventId/edit"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;

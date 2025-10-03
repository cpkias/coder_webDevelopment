import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { EventForm } from './components/events/EventForm';
import { EventRegistration } from './components/events/EventRegistration';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              
              {/* About and Contact Pages */}
              <Route path="/about" element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>About Us</h1>
                  <p>College Event Management System - Connecting students with amazing campus events.</p>
                </div>
              } />
              <Route path="/contact" element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>Contact Us</h1>
                  <p>Email: info@college-events.edu</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              } />

              {/* Protected Routes - Authenticated Users */}
              <Route path="/events/:eventId/register" element={
                <ProtectedRoute>
                  <EventRegistration />
                </ProtectedRoute>
              } />

              {/* Protected Routes - Organizers */}
              <Route path="/events/create" element={
                <ProtectedRoute requiredRole="organizer" requireApproval={true}>
                  <EventForm />
                </ProtectedRoute>
              } />
              <Route path="/events/:eventId/edit" element={
                <ProtectedRoute requiredRole="organizer" requireApproval={true}>
                  <EventForm />
                </ProtectedRoute>
              } />

              {/* Unauthorized Page */}
              <Route path="/unauthorized" element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              } />

              {/* 404 Page */}
              <Route path="*" element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
      
      {/* Toast Notifications */}
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
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
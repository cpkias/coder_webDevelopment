import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import React from 'react';

jest.mock('@/modules/auth/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'student' }, loading: false })
}));

test('renders children for allowed user', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(screen.getByText('Secret')).toBeInTheDocument();
});

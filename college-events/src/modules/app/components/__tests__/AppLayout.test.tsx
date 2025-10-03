import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { AppLayout } from '../AppLayout';

jest.mock('@/modules/auth/AuthContext', () => ({
  useAuth: () => ({ user: null, signOutUser: jest.fn(), loading: false })
}));

test('shows navigation links', () => {
  render(
    <MemoryRouter>
      <AppLayout>
        <div>Child</div>
      </AppLayout>
    </MemoryRouter>
  );
  expect(screen.getByText('College Events')).toBeInTheDocument();
  expect(screen.getByText('Events')).toBeInTheDocument();
  expect(screen.getByText('About')).toBeInTheDocument();
});

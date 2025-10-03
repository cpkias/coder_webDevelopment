import '@testing-library/jest-dom';

// Mock firebase services to avoid import.meta.env and SDK initialization in tests
jest.mock('@/services/firebase', () => ({
  auth: {},
  firestore: {},
  storage: {},
}));

// Mock firebase/auth getAuth to return no current user
jest.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: null }),
}));

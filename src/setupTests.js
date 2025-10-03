/**
 * Jest Setup
 * Configure testing environment
 */

import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./config/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  functions: {},
  googleProvider: {},
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

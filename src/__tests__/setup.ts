/**
 * Vitest Setup File
 * Configuration for testing environment
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.config
declare global {
  interface Window {
    config: {
      apiUrl: string;
      adminToken: string;
      arrCompany: Array<{
        name: string;
        apiUrl: string;
        adminToken: string;
      }>;
    };
  }
}

Object.defineProperty(window, 'config', {
  value: {
    apiUrl: 'http://localhost:5000',
    adminToken: 'test-token',
    arrCompany: [
      {
        name: 'Test Company',
        apiUrl: 'http://localhost:5000',
        adminToken: 'test-token',
      },
    ],
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress console errors during tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

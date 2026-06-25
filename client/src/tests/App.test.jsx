import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App.jsx';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock;

describe('App Smoke Test', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});

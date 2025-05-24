import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add React Testing Library matchers
expect.extend(matchers);

// Run cleanup after each test
afterEach(() => {
  cleanup();
});
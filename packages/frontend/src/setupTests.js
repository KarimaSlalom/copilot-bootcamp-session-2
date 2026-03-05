// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress known MUI v5 + jsdom "not wrapped in act(...)" warnings.
// These come from MUI's internal animation state updates (TouchRipple, Tooltip,
// FormControl, TransitionGroup, etc.) and are cosmetic noise, not test failures.
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
  originalConsoleError(...args);
};
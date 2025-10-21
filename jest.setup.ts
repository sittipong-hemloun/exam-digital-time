// jest.setup.ts
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fullscreen API
Object.defineProperty(Element.prototype, 'requestFullscreen', {
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(document, 'exitFullscreen', {
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null,
});

// Global test setup
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.PORT = '3001';

// Global test utilities and mocks can be added here
global.console = {
  ...console,
  // Silence console.log during tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

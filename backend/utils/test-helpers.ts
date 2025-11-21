import { UploadedFile } from '../lib/store';

// Mock data generators for consistent testing
export const createMockFile = (
  overrides?: Partial<UploadedFile>
): UploadedFile => ({
  filename: 'test-file.pdf',
  text: 'Mock file content for testing purposes.',
  timestamp: Date.now(),
  embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
  ...overrides,
});

export const createMockFiles = (count: number): UploadedFile[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockFile({
      filename: `test-file-${index + 1}.pdf`,
      text: `Mock content for file ${index + 1}`,
      timestamp: Date.now() + index * 1000,
    })
  );
};

// Test utilities
export const waitFor = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const expectToContainFile = (
  files: UploadedFile[],
  filename: string
): void => {
  expect(files.some((file) => file.filename === filename)).toBe(true);
};

export const expectFileCount = (
  files: UploadedFile[],
  expectedCount: number
): void => {
  expect(files).toHaveLength(expectedCount);
};

// Common test assertions
export const assertValidFile = (file: UploadedFile): void => {
  expect(file).toHaveProperty('filename');
  expect(file).toHaveProperty('text');
  expect(file).toHaveProperty('timestamp');
  expect(typeof file.filename).toBe('string');
  expect(typeof file.text).toBe('string');
  expect(typeof file.timestamp).toBe('number');
  expect(file.filename.length).toBeGreaterThan(0);
};

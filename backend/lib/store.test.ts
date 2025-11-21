import store, { UploadedFile } from './store';

describe('store', () => {
  beforeEach(() => {
    // Clear store before each test
    store.files = [];
  });

  test('should initialize with empty files array', () => {
    expect(store.files).toEqual([]);
    expect(store.files).toHaveLength(0);
  });

  test('should allow direct manipulation of files array', () => {
    const mockFile: UploadedFile = {
      filename: 'test.pdf',
      text: 'Test content',
      timestamp: Date.now(),
      embedding: [0.1, 0.2, 0.3],
    };

    store.files.push(mockFile);

    expect(store.files).toHaveLength(1);
    expect(store.files[0]).toEqual(mockFile);
  });

  test('should maintain reference integrity', () => {
    const initialFiles = store.files;

    store.files.push({
      filename: 'test.pdf',
      text: 'Test content',
      timestamp: Date.now(),
      embedding: [0.1, 0.2, 0.3],
    });

    // Should be the same reference
    expect(store.files).toBe(initialFiles);
  });

  test('should handle multiple file operations', () => {
    const mockFiles: UploadedFile[] = [
      {
        filename: 'file1.pdf',
        text: 'Content 1',
        timestamp: 1000,
        embedding: [0.1, 0.2, 0.3],
      },
      {
        filename: 'file2.pdf',
        text: 'Content 2',
        timestamp: 2000,
        embedding: [0.4, 0.5, 0.6],
      },
    ];

    // Add files
    store.files.push(...mockFiles);
    expect(store.files).toHaveLength(2);

    // Remove a file
    store.files.splice(0, 1);
    expect(store.files).toHaveLength(1);
    expect(store.files[0]).toEqual(mockFiles[1]);

    // Clear all files
    store.files.length = 0;
    expect(store.files).toHaveLength(0);
  });
});

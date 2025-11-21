import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that can be extended with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // Add any global providers here (e.g., theme providers, context providers)
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Mock data generators
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

export const mockFile = {
  id: '1',
  name: 'test-file.pdf',
  size: 1024,
  type: 'application/pdf',
  uploadedAt: new Date().toISOString(),
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

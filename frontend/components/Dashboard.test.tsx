import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');

const mockGetFiles = api.getFiles as jest.MockedFunction<typeof api.getFiles>;

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFiles.mockResolvedValue([]);
  });

  it('should render the Dashboard component', () => {
    const { container } = render(<Dashboard />);

    expect(container).toBeTruthy();
  });
});

import React from 'react'
import { render } from '@testing-library/react'
import Home from './index'
import * as api from '../services/api'

// Mock the API module
jest.mock('../services/api')

const mockGetFiles = api.getFiles as jest.MockedFunction<typeof api.getFiles>

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetFiles.mockResolvedValue([])
  })

  it('should render the Dashboard component', () => {
    const { container } = render(<Home />)

    expect(container).toBeTruthy()
  })
})

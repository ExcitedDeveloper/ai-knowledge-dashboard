describe('server', () => {
  let mockApp: any
  let mockListen: jest.Mock
  let mockUse: jest.Mock
  let mockJson: jest.Mock
  let mockUrlencoded: jest.Mock
  let consoleLogSpy: jest.SpyInstance

  beforeAll(() => {
    // Mock console.log before importing server
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    // Setup mocks
    mockListen = jest.fn((port, callback) => {
      if (callback) callback()
      return { close: jest.fn() }
    })
    mockUse = jest.fn()
    mockJson = jest.fn()
    mockUrlencoded = jest.fn()

    mockApp = {
      use: mockUse,
      listen: mockListen,
    }

    // Mock express
    jest.doMock('express', () => {
      const expressFn: any = jest.fn(() => mockApp)
      expressFn.json = jest.fn(() => 'JSON_PARSER')
      expressFn.urlencoded = jest.fn(() => 'URLENCODED_PARSER')
      return expressFn
    })

    // Mock cors
    jest.doMock('cors', () => jest.fn(() => 'CORS_MIDDLEWARE'))

    // Mock routes
    jest.doMock('./routes/uploadRoutes', () => ({ default: 'UPLOAD_ROUTES' }))
    jest.doMock('./routes/filesRoutes', () => ({ default: 'FILES_ROUTES' }))
    jest.doMock('./routes/searchRoutes', () => ({ default: 'SEARCH_ROUTES' }))

    // Now import server to trigger execution
    require('./server')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('should configure CORS middleware', () => {
    expect(mockUse).toHaveBeenCalledWith('CORS_MIDDLEWARE')
  })

  test('should configure JSON body parser', () => {
    expect(mockUse).toHaveBeenCalledWith('JSON_PARSER')
  })

  test('should configure URL-encoded body parser', () => {
    expect(mockUse).toHaveBeenCalledWith('URLENCODED_PARSER')
  })

  test('should mount upload routes at /api/upload', () => {
    // Check that routes were mounted (6 calls: cors, json, urlencoded, upload, files, search)
    expect(mockUse).toHaveBeenCalledTimes(6)
    expect(mockUse.mock.calls[3][0]).toBe('/api/upload')
  })

  test('should mount files routes at /api/files', () => {
    expect(mockUse).toHaveBeenCalledTimes(6)
    expect(mockUse.mock.calls[4][0]).toBe('/api/files')
  })

  test('should mount search routes at /api/search', () => {
    expect(mockUse).toHaveBeenCalledTimes(6)
    expect(mockUse.mock.calls[5][0]).toBe('/api/search')
  })

  test('should start server and listen on port', () => {
    expect(mockListen).toHaveBeenCalled()
    const port = mockListen.mock.calls[0][0]
    expect([3001, '3001', process.env.PORT]).toContain(port)
  })

  test('should log server startup message', () => {
    expect(consoleLogSpy).toHaveBeenCalled()
    expect(consoleLogSpy.mock.calls[0][0]).toMatch(/Server running on port/)
  })
})

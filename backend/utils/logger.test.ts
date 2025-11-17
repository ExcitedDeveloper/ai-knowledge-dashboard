import { LogLevel, logInfo, logError, logRequest } from './logger'

describe('logger', () => {
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance
  let dateNowSpy: jest.SpyInstance

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    // Mock Date.toISOString to return a consistent timestamp
    const fixedDate = new Date('2024-01-01T12:00:00.000Z')
    dateNowSpy = jest.spyOn(global, 'Date').mockImplementation(() => fixedDate as unknown as Date)
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    dateNowSpy.mockRestore()
  })

  describe('LogLevel enum', () => {
    it('should have INFO level', () => {
      expect(LogLevel.INFO).toBe('INFO')
    })

    it('should have ERROR level', () => {
      expect(LogLevel.ERROR).toBe('ERROR')
    })

    it('should have REQUEST level', () => {
      expect(LogLevel.REQUEST).toBe('REQUEST')
    })
  })

  describe('logInfo', () => {
    it('should log info message with correct format', () => {
      logInfo('Test info message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test info message')
      )
    })

    it('should include timestamp in log', () => {
      logInfo('Test message')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('2024-01-01T12:00:00.000Z')
      )
    })

    it('should handle empty message', () => {
      logInfo('')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      )
    })

    it('should handle long message', () => {
      const longMessage = 'a'.repeat(1000)
      logInfo(longMessage)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(longMessage)
      )
    })

    it('should handle special characters', () => {
      const specialMessage = '!@#$%^&*()_+{}|:"<>?[]\\;\',./`~'
      logInfo(specialMessage)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(specialMessage)
      )
    })

    it('should handle unicode characters', () => {
      const unicodeMessage = 'Hello 世界 🌍 مرحبا'
      logInfo(unicodeMessage)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(unicodeMessage)
      )
    })
  })

  describe('logError', () => {
    it('should log error message with correct format', () => {
      logError('Test error message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]')
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test error message')
      )
    })

    it('should include timestamp in error log', () => {
      logError('Error occurred')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('2024-01-01T12:00:00.000Z')
      )
    })

    it('should log Error object with stack trace', () => {
      const error = new Error('Test error')
      logError('Error occurred', error)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]')
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(error.stack)
    })

    it('should handle Error without stack trace', () => {
      const error = new Error('Test error')
      delete (error as { stack?: string }).stack

      logError('Error occurred', error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(JSON.stringify(error, null, 2))
    })

    it('should handle non-Error object', () => {
      const errorObj = { code: 500, message: 'Server error' }
      logError('Error occurred', errorObj)

      expect(consoleErrorSpy).toHaveBeenCalledWith(JSON.stringify(errorObj, null, 2))
    })

    it('should handle string error', () => {
      const errorString = 'Something went wrong'
      logError('Error occurred', errorString)

      expect(consoleErrorSpy).toHaveBeenCalledWith(JSON.stringify(errorString, null, 2))
    })

    it('should not log to console.error when error is null', () => {
      logError('Error occurred', null)

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should handle undefined error', () => {
      logError('Error occurred', undefined)

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should work without error parameter', () => {
      logError('Simple error message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should handle TypeError', () => {
      const error = new TypeError('Type mismatch')
      logError('Type error occurred', error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(error.stack)
    })

    it('should handle ReferenceError', () => {
      const error = new ReferenceError('Variable not defined')
      logError('Reference error occurred', error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(error.stack)
    })
  })

  describe('logRequest', () => {
    it('should log HTTP request with correct format', () => {
      logRequest('GET', '/api/users')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[REQUEST]')
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('GET')
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/users')
      )
    })

    it('should include timestamp in request log', () => {
      logRequest('POST', '/api/data')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('2024-01-01T12:00:00.000Z')
      )
    })

    it('should handle different HTTP methods', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']

      methods.forEach(method => {
        consoleLogSpy.mockClear()
        logRequest(method, '/api/endpoint')

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining(method)
        )
      })
    })

    it('should handle routes with query parameters', () => {
      logRequest('GET', '/api/search?q=test&limit=10')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/search?q=test&limit=10')
      )
    })

    it('should handle routes with path parameters', () => {
      logRequest('GET', '/api/users/123/posts/456')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/123/posts/456')
      )
    })

    it('should handle root route', () => {
      logRequest('GET', '/')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('GET /')
      )
    })

    it('should handle empty route', () => {
      logRequest('GET', '')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('GET ')
      )
    })
  })

  describe('timestamp formatting', () => {
    it('should format timestamp as ISO string', () => {
      logInfo('Test')

      const logCall = consoleLogSpy.mock.calls[0][0]
      expect(logCall).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
    })

    it('should include consistent timestamp format across different log types', () => {
      logInfo('Info message')
      const infoLog = consoleLogSpy.mock.calls[0][0]

      consoleLogSpy.mockClear()
      logError('Error message')
      const errorLog = consoleLogSpy.mock.calls[0][0]

      consoleLogSpy.mockClear()
      logRequest('GET', '/api')
      const requestLog = consoleLogSpy.mock.calls[0][0]

      // All should have the same timestamp format
      const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      expect(infoLog).toMatch(timestampRegex)
      expect(errorLog).toMatch(timestampRegex)
      expect(requestLog).toMatch(timestampRegex)
    })
  })
})

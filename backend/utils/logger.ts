/**
 * Simple logging utility for the application
 * Formats logs consistently with timestamps
 */

export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  REQUEST = 'REQUEST',
}

const formatTimestamp = (): string => {
  return new Date().toISOString()
}

const log = (level: LogLevel, message: string, data?: unknown): void => {
  const timestamp = formatTimestamp()
  const logMessage = `[${level}] ${message} - ${timestamp}`

  if (data) {
    console.log(logMessage, JSON.stringify(data, null, 2))
  } else {
    console.log(logMessage)
  }
}

export const logInfo = (message: string, data?: unknown): void => {
  log(LogLevel.INFO, message, data)
}

export const logError = (message: string, error?: unknown): void => {
  log(LogLevel.ERROR, message)

  // Log stack trace internally for debugging
  if (error instanceof Error && error.stack) {
    console.error(error.stack)
  } else if (error) {
    console.error(JSON.stringify(error, null, 2))
  }
}

export const logRequest = (method: string, route: string): void => {
  const timestamp = formatTimestamp()
  console.log(`[${LogLevel.REQUEST}] ${method} ${route} - ${timestamp}`)
}

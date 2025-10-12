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

const log = (level: LogLevel, message: string): void => {
  const timestamp = formatTimestamp()
  console.log(`[${level}] ${message} - ${timestamp}`)
}

export const logInfo = (message: string): void => {
  log(LogLevel.INFO, message)
}

export const logError = (message: string, error?: unknown): void => {
  log(LogLevel.ERROR, message)

  // Log stack trace internally for debugging
  if (error instanceof Error && error.stack) {
    console.error(error.stack)
  } else if (error) {
    console.error(error)
  }
}

export const logRequest = (method: string, route: string): void => {
  const timestamp = formatTimestamp()
  console.log(`[${LogLevel.REQUEST}] ${method} ${route} - ${timestamp}`)
}

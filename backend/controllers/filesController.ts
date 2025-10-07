import { Response } from 'express'
import store, { UploadedFile } from '../lib/store'

const ALLOWED_FILE_TYPES = ['txt'] as const
export type AllowedFileTypes = typeof ALLOWED_FILE_TYPES[number]

const isAllowedFileType = (type: string): type is AllowedFileTypes => {
  return ALLOWED_FILE_TYPES.includes(type as AllowedFileTypes)
}

export const addFile = (file: UploadedFile): void => {
  store.files.push(file)
}

export const getFiles = (): UploadedFile[] => {
  return store.files
}

export const validateFile = (
  res: Response,
  file: Express.Multer.File | undefined
): file is Express.Multer.File => {
  if (!file) {
    res.status(400).send('No file uploaded')
    return false
  }

  const fileExtension = file.filename.split('.').pop()?.toLowerCase()

  if (!fileExtension || !isAllowedFileType(fileExtension)) {
    res.status(400).send('Invalid file type')
    return false
  }

  return true
}

import { Response } from 'express'
import store, { UploadedFile } from '../lib/store'

const ALLOWED_FILE_TYPES = ['txt'] as const
export type AllowedFileTypes = (typeof ALLOWED_FILE_TYPES)[number]

const isAllowedFileType = (type: string): type is AllowedFileTypes => {
  return ALLOWED_FILE_TYPES.includes(type as AllowedFileTypes)
}

export const addFile = (file: UploadedFile): void => {
  store.files.push(file)
}

export const getFiles = (): UploadedFile[] => {
  return store.files
}

const isEmptyFile = (file: Express.Multer.File): boolean => {
  return file.size === 0
}

export const validateFile = (
  res: Response,
  file: Express.Multer.File | undefined
): file is Express.Multer.File => {
  if (!file) {
    res.status(400).send('No file uploaded')
    return false
  }

  const fileExtension = file.originalname.split('.').pop()?.toLowerCase()

  if (!fileExtension) {
    res.status(400).send('A file was not specified for upload')
    return false
  }

  if (!isAllowedFileType(fileExtension)) {
    res.status(400).send(`Invalid file type fileExtension: '${fileExtension}'`)
    return false
  }

  if (isEmptyFile(file)) {
    res.status(400).send('Uploaded file is empty')
    return false
  }

  return true
}

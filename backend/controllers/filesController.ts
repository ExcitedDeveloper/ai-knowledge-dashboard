import store, { UploadedFile } from '../lib/store'

export const addFile = (file: UploadedFile): void => {
  store.files.push(file)
}

export const getFiles = (): UploadedFile[] => {
  return store.files
}

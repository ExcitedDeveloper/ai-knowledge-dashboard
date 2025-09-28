// lib/store.ts
export type UploadedFile = {
  filename: string
  text: string
  timestamp: number
}

type Store = {
  files: UploadedFile[]
}

const store: Store = {
  files: [],
}

export default store

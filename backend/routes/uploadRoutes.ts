import { Router } from 'express'
import multer from 'multer'
import { handleFileUpload } from '../controllers/uploadController'

const router = Router()

// Configure multer to save uploaded files to /uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB in bytes
  },
})

// POST /api/upload
router.post('/', upload.single('file'), handleFileUpload)

export default router

import { Router } from 'express'
import multer from 'multer'
import { handleFileUpload } from '../controllers/uploadController.js'

const router = Router()

// Configure multer to save uploaded files to /uploads
const upload = multer({ dest: 'uploads/' })

// POST /api/upload
router.post('/', upload.single('file'), handleFileUpload)

export default router

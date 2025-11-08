import { Router } from 'express'
import { deleteFile, getFiles } from '../controllers/filesController.js'
import { logError } from '../utils/logger.js'
import { UUID } from 'crypto'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const files = await getFiles()
    res.json(files)
  } catch (error) {
    logError('Failed to retrieve files', error)
    res.status(500).json({ error: 'Failed to retrieve files' })
  }
})

router.delete('/:id', async (req, res) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' })
  }

  const id = req.params.id as UUID

  try {
    await deleteFile(id)
    res.sendStatus(204)
  } catch (error) {
    logError('Failed to delete file', error)
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

export default router

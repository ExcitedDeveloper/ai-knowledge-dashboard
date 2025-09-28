import { Router } from 'express'
import { getFiles } from '../controllers/filesController'

const router = Router()

router.get('/', (_req, res) => {
  res.json(getFiles())
})

export default router

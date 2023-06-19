import { Router } from 'express'
const router = Router()

import {create, findAll, findById, topNews} from '../controllers/news.cotroller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

router.post('/', authMiddleware, create)
router.get('/', findAll)
router.get('/top', topNews)
router.get('/:id', findById)
export default router
import { Router } from 'express'
const router = Router()

import {create, findAll, findById, topNews, searchByTitle, byUser} from '../controllers/news.cotroller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

router.post('/', authMiddleware, create)
router.get('/', findAll)
router.get('/top', topNews)
router.get('/search', searchByTitle)
router.get('/byUser', authMiddleware, byUser)



router.get('/:id', authMiddleware, findById)
export default router
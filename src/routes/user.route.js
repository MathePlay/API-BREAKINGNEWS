import { Router } from 'express'
const router = Router()
import { create, findAll, findById, update } from '../controllers/user.controller.js'
import { validId, validUser } from '../middlewares/goblal.middlewares.js'

router.post('/', create)
router.get('/', findAll)
router.get('/:id', validId, validUser, findById)
router.patch('/:id', validId, validUser, update)

export default router


import { Router } from 'express'
import { Auth } from '../../../shared/middlewares/auth-middleware.js'
import { FacultyController } from '../controller/FacultyController.js'

const router = Router()

router.get('/', Auth, FacultyController.getAll)
router.get('/:id', Auth, FacultyController.getById)

export default router

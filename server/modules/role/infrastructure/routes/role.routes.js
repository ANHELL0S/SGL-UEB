import { Router } from 'express'
import { RoleController } from '../controller/RoleController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'

const router = Router()

router.get('/', Auth, RoleController.getAllRoles)
router.get('/my-roles', Auth, RoleController.getMeRole)
router.get('/:id', Auth, RoleController.getRoleById)

export default router

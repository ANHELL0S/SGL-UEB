import { Router } from 'express'
import { LogController } from '../controller/LogController.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'

const router = Router()

router.get('/', Auth, hasRole([ROLES.GENERAL_ADMIN]), LogController.getAll)

export default router

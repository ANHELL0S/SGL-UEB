import { Router } from 'express'
import { KardexController } from '../controller/kardexController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'

const router = Router()

router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	KardexController.getAll
)
router.get(
	'/pertain-user',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	KardexController.getAllPertainToUser
)
router.get('/report/pdf', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), KardexController.generateReport)

export default router

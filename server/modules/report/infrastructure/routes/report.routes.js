import { Router } from 'express'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { ReportController } from '../controller/ReportController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'

const router = Router()

router.get('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ReportController.getAll)
router.get(
	'/:id/pertain-sample',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ReportController.getAllToSample
)
router.get(
	'/:id/pertain-analyst',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ReportController.getAllToSample
)
router.put('/:id/change-status', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ReportController.update)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ReportController.delete)
router.get(
	'/report',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.ACCESS_MANAGER, ROLES.TECHNICAL_ANALYST]),
	ReportController.generateReport
)

export default router

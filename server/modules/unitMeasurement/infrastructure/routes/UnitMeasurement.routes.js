import { Router } from 'express'
import { UnitMeasurementController } from '../controller/UnitMeasurementController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'

const router = Router()

router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	UnitMeasurementController.getAll
)
router.get(
	'/:id',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	UnitMeasurementController.getById
)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), UnitMeasurementController.create)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), UnitMeasurementController.update)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), UnitMeasurementController.delete)

export default router

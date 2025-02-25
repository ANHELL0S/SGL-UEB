import { Router } from 'express'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { ConsumptionController } from '../controller/ConsumptionController.js'

const router = Router()

router.get('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ConsumptionController.getAll)
router.get(
	'/pertain-user',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ConsumptionController.getAllToUser
)
router.get(
	'/:id/pertain-access',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ConsumptionController.getAllToAccess
)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ConsumptionController.create)
router.post(
	'/independent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ConsumptionController.createIndependent
)
router.delete(
	'/:id/permanent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ConsumptionController.delete
)
router.delete(
	'/:id/independent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ConsumptionController.deleteIndependent
)

export default router
